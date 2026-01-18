import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import type { CompanySetupLead } from '@/hooks/useCompanySetupLeads';

interface BaseDialogProps {
  lead: CompanySetupLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string) => void;
  isLoading?: boolean;
}

// Change Status Dialog
export const ChangeStatusDialog = ({
  lead,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: BaseDialogProps) => {
  const [status, setStatus] = useState(lead?.status || 'new');

  const statuses = [
    { value: 'new', label: 'Nuevo', description: 'Lead recién llegado' },
    { value: 'contacted', label: 'Contactado', description: 'Ya se ha contactado' },
    { value: 'qualified', label: 'Cualificado', description: 'Lead cualificado' },
    { value: 'proposal', label: 'Propuesta', description: 'Propuesta enviada' },
    { value: 'won', label: 'Ganado', description: 'Cliente conseguido' },
    { value: 'lost', label: 'Perdido', description: 'Lead descartado' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar estado</DialogTitle>
          <DialogDescription>
            Actualiza el estado del lead: {lead?.name}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={status} onValueChange={setStatus} className="gap-3">
          {statuses.map((s) => (
            <div key={s.value} className="flex items-center space-x-3">
              <RadioGroupItem value={s.value} id={s.value} />
              <Label htmlFor={s.value} className="flex flex-col cursor-pointer">
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-slate-500">{s.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(status)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Change Priority Dialog
export const ChangePriorityDialog = ({
  lead,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: BaseDialogProps) => {
  const [priority, setPriority] = useState(lead?.priority || 'medium');

  const priorities = [
    { value: 'urgent', label: 'Urgente', description: 'Requiere atención inmediata', color: 'text-red-600' },
    { value: 'high', label: 'Alta', description: 'Prioridad alta', color: 'text-amber-600' },
    { value: 'medium', label: 'Media', description: 'Prioridad normal', color: 'text-slate-600' },
    { value: 'low', label: 'Baja', description: 'Puede esperar', color: 'text-slate-400' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar prioridad</DialogTitle>
          <DialogDescription>
            Actualiza la prioridad del lead: {lead?.name}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={priority} onValueChange={setPriority} className="gap-3">
          {priorities.map((p) => (
            <div key={p.value} className="flex items-center space-x-3">
              <RadioGroupItem value={p.value} id={`priority-${p.value}`} />
              <Label htmlFor={`priority-${p.value}`} className="flex flex-col cursor-pointer">
                <span className={`font-medium ${p.color}`}>{p.label}</span>
                <span className="text-xs text-slate-500">{p.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(priority)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Assign Lead Dialog
export const AssignLeadDialog = ({
  lead,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: BaseDialogProps) => {
  const [assignedTo, setAssignedTo] = useState(lead?.assigned_to || '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar lead</DialogTitle>
          <DialogDescription>
            Asigna este lead a un miembro del equipo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Asignar a (ID de usuario)</Label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Introduce el ID del usuario"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(assignedTo)} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Asignar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Note Dialog
interface AddNoteDialogProps extends Omit<BaseDialogProps, 'onConfirm'> {
  onConfirm: (note: string) => void;
}

export const AddNoteDialog = ({
  lead,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: AddNoteDialogProps) => {
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    onConfirm(note);
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir nota</DialogTitle>
          <DialogDescription>
            Añade una nota al lead: {lead?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escribe tu nota aquí..."
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !note.trim()}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Añadir nota
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
interface DeleteDialogProps {
  lead: CompanySetupLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteLeadDialog = ({
  lead,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar lead</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar el lead de{' '}
            <strong>{lead?.name}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
