#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface LinkIssue {
  file: string;
  line: number;
  column: number;
  linkTo: string;
  context: string;
  severity: 'error' | 'warning';
  suggestion: string;
  type: 'hardcoded-route' | 'concatenated-slug' | 'mixed-imports';
}

interface ValidationResult {
  totalFiles: number;
  filesWithIssues: number;
  issues: LinkIssue[];
  summary: {
    errors: number;
    warnings: number;
  };
}

// Rutas excluidas de la validación
const EXCLUDED_PATTERNS = [
  '**/admin/**',
  '**/components/ui/language-link.tsx',
  '**/components/ui/logo.tsx',
  '**/scripts/**',
  '**/integrations/**',
  '**/*.test.tsx',
  '**/*.spec.tsx',
];

// Detectar si es una ruta interna que debe usar LanguageLink
const isInternalRoute = (to: string): boolean => {
  // Excluir rutas externas
  if (to.match(/^https?:\/\//)) return false;
  
  // Excluir hash links
  if (to.startsWith('#')) return false;
  
  // Excluir rutas admin
  if (to.startsWith('/admin')) return false;
  
  // Rutas internas comienzan con /
  return to.startsWith('/');
};

// Obtener número de línea a partir del índice
const getLineNumber = (content: string, index: number): number => {
  return content.substring(0, index).split('\n').length;
};

// Obtener snippet de contexto
const getContextSnippet = (content: string, index: number, length: number = 80): string => {
  const start = Math.max(0, index - 20);
  const end = Math.min(content.length, index + length);
  let snippet = content.substring(start, end).trim();
  
  // Eliminar saltos de línea para contexto más limpio
  snippet = snippet.replace(/\s+/g, ' ');
  
  return snippet.length > 100 ? snippet.substring(0, 100) + '...' : snippet;
};

// Agrupar issues por archivo
const groupBy = <T extends Record<string, any>>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const group = item[key] as string;
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

// Analizar un archivo en busca de problemas
const analyzeFile = (filePath: string): LinkIssue[] => {
  const issues: LinkIssue[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Verificar imports
  const hasLinkImport = content.includes("from 'react-router-dom'") && 
                        /import\s+\{[^}]*\bLink\b[^}]*\}\s+from\s+['"]react-router-dom['"]/.test(content);
  const hasLanguageLinkImport = content.includes("from '@/components/ui/language-link'");
  
  if (!hasLinkImport) return issues;
  
  // Advertencia si mezcla imports
  if (hasLinkImport && hasLanguageLinkImport) {
    const importMatch = content.match(/import\s+\{[^}]*\bLink\b[^}]*\}\s+from\s+['"]react-router-dom['"]/);
    if (importMatch) {
      issues.push({
        file: filePath,
        line: getLineNumber(content, importMatch.index!),
        column: 1,
        linkTo: '',
        context: 'Mixed imports: Link and LanguageLink',
        severity: 'warning',
        suggestion: 'Eliminar import de Link y usar solo LanguageLink para consistencia',
        type: 'mixed-imports'
      });
    }
  }
  
  // Patrón 1: <Link to="/ruta">
  const linkPattern1 = /<Link\s+to=["']([^"']+)["']/g;
  let match1;
  
  while ((match1 = linkPattern1.exec(content)) !== null) {
    const linkTo = match1[1];
    
    if (isInternalRoute(linkTo)) {
      const lineNumber = getLineNumber(content, match1.index);
      const contextSnippet = getContextSnippet(content, match1.index);
      
      issues.push({
        file: filePath,
        line: lineNumber,
        column: match1.index - content.lastIndexOf('\n', match1.index),
        linkTo,
        context: contextSnippet,
        severity: 'error',
        suggestion: `Reemplazar con: <LanguageLink to="${linkTo}">`,
        type: 'hardcoded-route'
      });
    }
  }
  
  // Patrón 2: <Link to={`/ruta/${variable}`}>
  const linkPattern2 = /<Link\s+to=\{`([^`]+)`\}/g;
  let match2;
  
  while ((match2 = linkPattern2.exec(content)) !== null) {
    const linkTo = match2[1];
    
    // Detectar si es una ruta interna con interpolación
    if (linkTo.startsWith('/')) {
      const lineNumber = getLineNumber(content, match2.index);
      const contextSnippet = getContextSnippet(content, match2.index);
      
      // Determinar sugerencia específica según el tipo de ruta
      let suggestion = '';
      if (linkTo.includes('/servicios/')) {
        suggestion = 'Usar getServicePath(slug_es, slug_ca, slug_en) en lugar de concatenación manual';
      } else if (linkTo.includes('/blog/')) {
        suggestion = 'Usar getBlogPath(slug_es, slug_ca, slug_en) en lugar de concatenación manual';
      } else if (linkTo.includes('/casos-de-exito/')) {
        suggestion = 'Usar getCaseStudyPath(slug_es, slug_ca, slug_en) en lugar de concatenación manual';
      } else {
        suggestion = `Reemplazar con LanguageLink y usar helper de paths apropiado`;
      }
      
      issues.push({
        file: filePath,
        line: lineNumber,
        column: match2.index - content.lastIndexOf('\n', match2.index),
        linkTo,
        context: contextSnippet,
        severity: 'error',
        suggestion,
        type: 'concatenated-slug'
      });
    }
  }
  
  // Patrón 3: <Link to={variable}>
  const linkPattern3 = /<Link\s+to=\{([^}]+)\}/g;
  let match3;
  
  while ((match3 = linkPattern3.exec(content)) !== null) {
    const linkToVar = match3[1].trim();
    
    // Solo validar si no es un template literal (ya cubierto por patrón 2)
    if (!linkToVar.startsWith('`')) {
      const lineNumber = getLineNumber(content, match3.index);
      const contextSnippet = getContextSnippet(content, match3.index);
      
      issues.push({
        file: filePath,
        line: lineNumber,
        column: match3.index - content.lastIndexOf('\n', match3.index),
        linkTo: linkToVar,
        context: contextSnippet,
        severity: 'warning',
        suggestion: 'Verificar que la variable use getLocalizedPath() o helpers de localización',
        type: 'hardcoded-route'
      });
    }
  }
  
  return issues;
};

// Generar reporte formateado
const generateReport = (result: ValidationResult): string => {
  let report = `
╔══════════════════════════════════════════════════════════════╗
║           VALIDACIÓN DE LINKS - REPORTE COMPLETO            ║
╚══════════════════════════════════════════════════════════════╝

📊 RESUMEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Archivos analizados:        ${result.totalFiles}
  Archivos con problemas:     ${result.filesWithIssues}
  Errores (❌):                ${result.summary.errors}
  Advertencias (⚠️):           ${result.summary.warnings}

`;

  if (result.issues.length === 0) {
    report += `✅ ¡EXCELENTE! No se encontraron problemas.\n`;
    report += `   Todas las rutas usan correctamente LanguageLink.\n\n`;
    return report;
  }

  // Agrupar por archivo
  const issuesByFile = groupBy(result.issues, 'file');
  
  report += `\n🔍 PROBLEMAS DETECTADOS\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  for (const [file, issues] of Object.entries(issuesByFile)) {
    const relativeFile = file.replace(process.cwd(), '');
    report += `📄 ${relativeFile}\n`;
    
    issues.forEach((issue) => {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      const typeLabel = issue.type === 'mixed-imports' ? 'IMPORTS MEZCLADOS' : 
                       issue.type === 'concatenated-slug' ? 'SLUG CONCATENADO' : 
                       'RUTA HARDCODEADA';
      
      report += `  ${icon} Línea ${issue.line} [${typeLabel}]\n`;
      if (issue.linkTo) {
        report += `     Ruta: ${issue.linkTo}\n`;
      }
      report += `     Contexto: ${issue.context}\n`;
      report += `     💡 ${issue.suggestion}\n\n`;
    });
  }
  
  report += `\n📋 ACCIONES RECOMENDADAS\n`;
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  report += `  1. Revisa cada archivo marcado\n`;
  report += `  2. Reemplaza <Link> por <LanguageLink> para rutas internas\n`;
  report += `  3. Usa helpers de localización (getServicePath, getBlogPath, etc.)\n`;
  report += `  4. Ejecuta: npm run validate:links:fix para auto-corrección\n\n`;
  
  return report;
};

// Aplicar fixes automáticos
const applyFixes = (issues: LinkIssue[]): { fixed: number; failed: number } => {
  let fixed = 0;
  let failed = 0;
  
  const issuesByFile = groupBy(issues, 'file');
  
  for (const [filePath, fileIssues] of Object.entries(issuesByFile)) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      // Solo aplicar fixes a errores simples (hardcoded-route y mixed-imports)
      const fixableIssues = fileIssues.filter(i => 
        i.severity === 'error' && 
        (i.type === 'hardcoded-route' || i.type === 'mixed-imports')
      );
      
      if (fixableIssues.length === 0) continue;
      
      // Agregar import de LanguageLink si no existe
      if (!content.includes("from '@/components/ui/language-link'")) {
        const importMatch = content.match(/(import\s+\{[^}]*\bLink\b[^}]*\}\s+from\s+['"]react-router-dom['"];?\n)/);
        if (importMatch) {
          const newImport = `${importMatch[1]}import { LanguageLink } from '@/components/ui/language-link';\n`;
          content = content.replace(importMatch[1], newImport);
          modified = true;
        }
      }
      
      // Reemplazar <Link con <LanguageLink para rutas hardcodeadas
      for (const issue of fixableIssues) {
        if (issue.type === 'hardcoded-route' && issue.linkTo) {
          const oldPattern = new RegExp(`<Link\\s+to=["']${issue.linkTo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
          const newPattern = `<LanguageLink to="${issue.linkTo}"`;
          
          if (content.match(oldPattern)) {
            content = content.replace(oldPattern, newPattern);
            modified = true;
          }
        }
      }
      
      // Reemplazar </Link> con </LanguageLink>
      if (modified) {
        content = content.replace(/<\/Link>/g, '</LanguageLink>');
      }
      
      // Escribir archivo solo si hubo cambios
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Fijado: ${filePath.replace(process.cwd(), '')}`);
        fixed += fixableIssues.length;
      }
    } catch (error) {
      console.error(`❌ Error al fijar ${filePath}:`, error);
      failed += fileIssues.length;
    }
  }
  
  return { fixed, failed };
};

// Función principal
const main = async () => {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  
  console.log('\n🔍 Validando uso de Links en componentes React...\n');
  
  // Buscar todos los archivos .tsx
  const allFiles = await glob('src/**/*.tsx', {
    ignore: EXCLUDED_PATTERNS,
  });
  
  console.log(`📁 Analizando ${allFiles.length} archivos...\n`);
  
  const allIssues: LinkIssue[] = [];
  
  // Analizar cada archivo
  for (const file of allFiles) {
    const issues = analyzeFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues);
    }
  }
  
  // Preparar resultado
  const result: ValidationResult = {
    totalFiles: allFiles.length,
    filesWithIssues: new Set(allIssues.map(i => i.file)).size,
    issues: allIssues,
    summary: {
      errors: allIssues.filter(i => i.severity === 'error').length,
      warnings: allIssues.filter(i => i.severity === 'warning').length,
    }
  };
  
  // Generar y mostrar reporte
  const report = generateReport(result);
  console.log(report);
  
  // Aplicar fixes si se solicitó
  if (shouldFix && allIssues.length > 0) {
    console.log('\n🔧 Aplicando correcciones automáticas...\n');
    const { fixed, failed } = applyFixes(allIssues);
    
    console.log('\n📊 RESULTADO DE AUTO-FIX');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  ✅ Problemas corregidos:  ${fixed}`);
    console.log(`  ❌ Problemas no corregidos: ${failed}`);
    console.log(`  ⚠️  Revisa manualmente los casos de slugs concatenados\n`);
  }
  
  // Exit code según resultado
  if (result.summary.errors > 0 && !shouldFix) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

// Ejecutar
main().catch(console.error);
