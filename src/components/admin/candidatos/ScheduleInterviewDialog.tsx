import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, Video, User } from "lucide-react";
import { Candidato, useUpdateCandidato } from "@/hooks/useCandidatos";
import { useCreateEntrevista } from "@/hooks/useEntrevistas";
import { useEmpleados } from "@/hooks/useEmpleados";

interface ScheduleInterviewDialogProps {
  candidato: Candidato | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIPOS_ENTREVISTA = [
  { value: "telefonica", label: "Telefónica" },
  { value: "tecnica", label: "Técnica" },
  { value: "hr", label: "HR/Cultural" },
  { value: "final", label: "Final" },
  { value: "otro", label: "Otro" },
];

export function ScheduleInterviewDialog({
  candidato,
  open,
  onOpenChange,
}: ScheduleInterviewDialogProps) {
  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    tipo: "telefonica",
    ronda: 1,
    entrevistador_id: "",
    duracion_minutos: 60,
    ubicacion: "",
    meeting_url: "",
    notas: "",
  });

  const createEntrevista = useCreateEntrevista();
  const updateCandidato = useUpdateCandidato();
  const { data: empleados } = useEmpleados({ activo: true });

  const handleSubmit = () => {
    if (!candidato || !formData.fecha || !formData.hora || !formData.entrevistador_id) {
      return;
    }

    const fechaHora = `${formData.fecha}T${formData.hora}:00`;

    createEntrevista.mutate(
      {
        candidato_id: candidato.id,
        entrevistador_id: formData.entrevistador_id,
        fecha_hora: fechaHora,
        tipo: formData.tipo,
        ronda: formData.ronda,
        duracion_minutos: formData.duracion_minutos,
        ubicacion: formData.ubicacion || null,
        meeting_url: formData.meeting_url || null,
        estado: "programada",
      },
      {
        onSuccess: () => {
          // Optionally update candidate status to "entrevista"
          if (candidato.estado === "nuevo" || candidato.estado === "en_revision") {
            updateCandidato.mutate({
              id: candidato.id,
              updates: { estado: "entrevista" },
            });
          }
          onOpenChange(false);
          // Reset form
          setFormData({
            fecha: "",
            hora: "",
            tipo: "telefonica",
            ronda: 1,
            entrevistador_id: "",
            duracion_minutos: 60,
            ubicacion: "",
            meeting_url: "",
            notas: "",
          });
        },
      }
    );
  };

  if (!candidato) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            Programar entrevista
          </DialogTitle>
          <DialogDescription>
            Entrevista para {candidato.nombre} ({candidato.puesto_solicitado})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Fecha</Label>
              <Input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Hora</Label>
              <Input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
              />
            </div>
          </div>

          {/* Tipo y Ronda */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) => setFormData({ ...formData, tipo: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_ENTREVISTA.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Ronda</Label>
              <Select
                value={String(formData.ronda)}
                onValueChange={(v) => setFormData({ ...formData, ronda: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((ronda) => (
                    <SelectItem key={ronda} value={String(ronda)}>
                      Ronda {ronda}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Entrevistador */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Entrevistador</Label>
            <Select
              value={formData.entrevistador_id}
              onValueChange={(v) => setFormData({ ...formData, entrevistador_id: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar entrevistador" />
              </SelectTrigger>
              <SelectContent>
                {empleados?.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {emp.nombre}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duración */}
          <div className="space-y-2">
            <Label className="text-xs text-slate-500">Duración (minutos)</Label>
            <Select
              value={String(formData.duracion_minutos)}
              onValueChange={(v) => setFormData({ ...formData, duracion_minutos: Number(v) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1h 30min</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ubicación o Meeting URL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Ubicación
              </Label>
              <Input
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                placeholder="Sala de reuniones..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500 flex items-center gap-1">
                <Video className="h-3 w-3" />
                URL de reunión
              </Label>
              <Input
                value={formData.meeting_url}
                onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                placeholder="https://meet.google..."
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              createEntrevista.isPending ||
              !formData.fecha ||
              !formData.hora ||
              !formData.entrevistador_id
            }
          >
            {createEntrevista.isPending ? "Programando..." : "Programar entrevista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
