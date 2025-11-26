import { LandingPage } from '@/hooks/useLandingPages';

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn' | 'pending';
  points: number;
  message?: string;
}

export interface HealthCheckResult {
  score: number;
  checks: HealthCheck[];
  lastChecked: Date;
  grade: 'excellent' | 'good' | 'fair' | 'poor';
}

export const calculateHealthScore = (landing: LandingPage): HealthCheckResult => {
  const checks: HealthCheck[] = [];
  let score = 0;
  
  // 1. Título configurado (15 pts)
  if (landing.title?.length > 0) {
    score += 15;
    checks.push({ name: 'Título configurado', status: 'pass', points: 15 });
  } else {
    checks.push({ name: 'Título configurado', status: 'fail', points: 0, message: 'El título es obligatorio' });
  }
  
  // 2. Categoría asignada (10 pts)
  if (landing.category && landing.category !== 'Other') {
    score += 10;
    checks.push({ name: 'Categoría asignada', status: 'pass', points: 10 });
  } else {
    checks.push({ name: 'Categoría asignada', status: 'fail', points: 0, message: 'Asigna una categoría específica' });
  }
  
  // 3. URL configurada (15 pts)
  if (landing.url?.length > 0) {
    score += 15;
    checks.push({ name: 'URL configurada', status: 'pass', points: 15 });
  } else {
    checks.push({ name: 'URL configurada', status: 'fail', points: 0, message: 'Configura la URL de la landing' });
  }
  
  // 4. URL usa HTTPS (10 pts)
  if (landing.url?.startsWith('https://')) {
    score += 10;
    checks.push({ name: 'URL segura (HTTPS)', status: 'pass', points: 10 });
  } else if (landing.url?.startsWith('http://')) {
    checks.push({ name: 'URL segura (HTTPS)', status: 'warn', points: 0, message: 'La URL debe usar HTTPS' });
  } else {
    checks.push({ name: 'URL segura (HTTPS)', status: 'fail', points: 0, message: 'URL no configurada' });
  }
  
  // 5. Meta Title (10 pts)
  if (landing.meta_title?.length > 0) {
    score += 10;
    checks.push({ name: 'Meta título SEO', status: 'pass', points: 10 });
  } else {
    checks.push({ name: 'Meta título SEO', status: 'warn', points: 0, message: 'Añade meta título para SEO' });
  }
  
  // 6. Meta Description (10 pts)
  if (landing.meta_description?.length > 0) {
    score += 10;
    checks.push({ name: 'Meta descripción SEO', status: 'pass', points: 10 });
  } else {
    checks.push({ name: 'Meta descripción SEO', status: 'warn', points: 0, message: 'Añade meta descripción para SEO' });
  }
  
  // 7. QR Code generado (5 pts)
  if (landing.qr_code?.length > 0) {
    score += 5;
    checks.push({ name: 'Código QR generado', status: 'pass', points: 5 });
  } else {
    checks.push({ name: 'Código QR generado', status: 'warn', points: 0, message: 'Genera código QR para campaña offline' });
  }
  
  // 8. UTM URL configurada (5 pts)
  if (landing.utm_url?.length > 0) {
    score += 5;
    checks.push({ name: 'URL con UTM tracking', status: 'pass', points: 5 });
  } else {
    checks.push({ name: 'URL con UTM tracking', status: 'warn', points: 0, message: 'Genera URL con parámetros UTM' });
  }
  
  // 9. Status publicado (10 pts)
  if (landing.status === 'published') {
    score += 10;
    checks.push({ name: 'Estado publicado', status: 'pass', points: 10 });
  } else {
    checks.push({ name: 'Estado publicado', status: 'warn', points: 0, message: `Estado actual: ${landing.status}` });
  }
  
  // 10. Actualizado recientemente (10 pts)
  const daysSinceUpdate = landing.updated_at 
    ? Math.floor((Date.now() - new Date(landing.updated_at).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  
  if (daysSinceUpdate < 60) {
    score += 10;
    checks.push({ name: 'Actualizado recientemente', status: 'pass', points: 10, message: `Hace ${daysSinceUpdate} días` });
  } else {
    checks.push({ name: 'Actualizado recientemente', status: 'warn', points: 0, message: `Hace ${daysSinceUpdate} días - considera revisar` });
  }
  
  // Determinar grado
  let grade: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 85) grade = 'excellent';
  else if (score >= 70) grade = 'good';
  else if (score >= 50) grade = 'fair';
  else grade = 'poor';
  
  return {
    score,
    checks,
    lastChecked: new Date(),
    grade,
  };
};

export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'fair': return 'text-yellow-600';
    case 'poor': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'pass': return '✅';
    case 'fail': return '❌';
    case 'warn': return '⚠️';
    case 'pending': return '⏳';
    default: return '○';
  }
};
