import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { MarketingAuditState } from '@/lib/marketingAuditTypes';
import { toast } from 'sonner';

interface AuditPdfExportProps {
  state: MarketingAuditState;
}

export const AuditPdfExport = ({ state }: AuditPdfExportProps) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      let y = 20;

      const addText = (text: string, x: number, fontSize: number, color: [number, number, number] = [255, 255, 255], bold = false) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        if (bold) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(text, pageW - x - 15);
        doc.text(lines, x, y);
        y += lines.length * fontSize * 0.45 + 2;
      };

      const checkPage = (needed: number) => {
        if (y + needed > 280) { doc.addPage(); y = 20; }
      };

      // Cover
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 297, 'F');

      y = 60;
      addText('AUDITORÍA DE MARKETING DIGITAL', 15, 22, [59, 130, 246], true);
      y += 5;
      addText('Y SEO', 15, 22, [59, 130, 246], true);
      y += 15;
      addText(state.url, 15, 12, [148, 163, 184]);
      y += 5;
      addText(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), 15, 10, [100, 116, 139]);

      y += 30;
      const scoreColor: [number, number, number] = state.globalScore >= 75 ? [34, 197, 94] : state.globalScore >= 50 ? [234, 179, 8] : [239, 68, 68];
      addText(`${state.globalScore}`, 15, 48, scoreColor, true);
      addText('Puntuación Global / 100', 15, 12, [148, 163, 184]);

      // Categories page
      doc.addPage();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 297, 'F');
      y = 20;
      addText('RESUMEN POR CATEGORÍA', 15, 16, [59, 130, 246], true);
      y += 5;

      for (const cat of state.categories) {
        checkPage(30);
        const catColor: [number, number, number] = cat.score >= 75 ? [34, 197, 94] : cat.score >= 50 ? [234, 179, 8] : [239, 68, 68];
        addText(`${cat.name} — ${cat.score}/100 (Peso: ${cat.weight}%)`, 15, 12, catColor, true);
        
        for (const item of cat.items) {
          checkPage(10);
          const icon = item.status === 'correct' ? '✅' : item.status === 'improvable' ? '⚠️' : item.status === 'missing' ? '❌' : '⏳';
          addText(`  ${icon} ${item.label}: ${item.note || item.description}`, 20, 8, [203, 213, 225]);
        }
        y += 5;
      }

      // Quick Wins
      if (state.quickWins.length > 0) {
        doc.addPage();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageW, 297, 'F');
        y = 20;
        addText('QUICK WINS — TOP 10', 15, 16, [59, 130, 246], true);
        y += 5;
        state.quickWins.forEach((win, idx) => {
          checkPage(15);
          addText(`${idx + 1}. ${win.label}`, 15, 10, [255, 255, 255], true);
          addText(`   ${win.description}`, 20, 8, [148, 163, 184]);
          y += 2;
        });
      }

      // Recommendations
      if (state.recommendations.length > 0) {
        checkPage(40);
        y += 10;
        addText('RECOMENDACIONES', 15, 16, [59, 130, 246], true);
        y += 5;
        for (const rec of state.recommendations) {
          checkPage(20);
          const prioLabel = rec.priority === 'high' ? '🔴 Alta' : rec.priority === 'medium' ? '🟡 Media' : '🟢 Baja';
          addText(`[${prioLabel}] ${rec.title}`, 15, 10, [255, 255, 255], true);
          addText(`  ${rec.description}`, 20, 8, [148, 163, 184]);
          y += 3;
        }
      }

      doc.save(`audit-${new URL(state.url).hostname}-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF exportado correctamente');
    } catch (err: any) {
      toast.error('Error al exportar PDF');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline" className="gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      Exportar PDF
    </Button>
  );
};
