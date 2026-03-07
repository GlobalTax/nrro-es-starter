import { useState } from 'react';
import { useAuditSchedule } from '@/hooks/useAuditSchedule';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Play, Loader2, Calendar, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AuditScheduleManager = () => {
  const { entries, isLoading, addEntry, toggleActive, deleteEntry, runManualAudit } = useAuditSchedule();
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newFrequency, setNewFrequency] = useState('weekly');
  const [runningUrl, setRunningUrl] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    addEntry(newUrl.trim(), newLabel.trim() || newUrl.trim(), newFrequency);
    setNewUrl('');
    setNewLabel('');
  };

  const handleRun = async (url: string) => {
    setRunningUrl(url);
    await runManualAudit(url);
    setRunningUrl(null);
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-slate-600 text-slate-300';
    if (score >= 75) return 'bg-emerald-900/50 text-emerald-400 border-emerald-700';
    if (score >= 50) return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
    return 'bg-red-900/50 text-red-400 border-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Auditorías Programadas</h2>
      </div>

      {/* Add new entry */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <Input
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="https://ejemplo.com"
          className="bg-slate-900 border-slate-600 text-white flex-1"
        />
        <Input
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder="Nombre / etiqueta"
          className="bg-slate-900 border-slate-600 text-white w-48"
        />
        <Select value={newFrequency} onValueChange={setNewFrequency}>
          <SelectTrigger className="w-32 bg-slate-900 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensual</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleAdd} disabled={!newUrl.trim()} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Añadir
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-slate-500">
          <Globe className="h-10 w-10 mb-3 text-slate-600" />
          <p>No hay URLs programadas</p>
          <p className="text-sm mt-1">Añade URLs para auditar automáticamente cada semana o mes</p>
        </div>
      ) : (
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-400">Activo</TableHead>
                <TableHead className="text-slate-400">URL / Etiqueta</TableHead>
                <TableHead className="text-slate-400">Frecuencia</TableHead>
                <TableHead className="text-slate-400">Último audit</TableHead>
                <TableHead className="text-slate-400">Score</TableHead>
                <TableHead className="text-slate-400 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(entry => (
                <TableRow key={entry.id} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell>
                    <Switch
                      checked={entry.is_active}
                      onCheckedChange={() => toggleActive(entry.id, entry.is_active)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[250px]">{entry.label || entry.url}</p>
                      <p className="text-slate-500 text-xs truncate max-w-[250px]">{entry.url}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {entry.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {entry.last_audit_at
                      ? format(new Date(entry.last_audit_at), "d MMM yyyy, HH:mm", { locale: es })
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(entry.last_score)}>
                      {entry.last_score !== null ? `${entry.last_score}/100` : '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRun(entry.url)}
                        disabled={runningUrl === entry.url}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      >
                        {runningUrl === entry.url ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
