import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  FileText,
  Linkedin,
  Calendar,
  Trash2,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { Candidato } from "@/hooks/useCandidatos";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface CandidatosTableProps {
  candidatos: Candidato[] | undefined;
  isLoading: boolean;
  onView: (candidato: Candidato) => void;
  onScheduleInterview: (candidato: Candidato) => void;
  onChangeStatus: (candidato: Candidato, newStatus: string) => void;
  onDelete: (candidato: Candidato) => void;
}

const ESTADOS: Record<string, { label: string; className: string }> = {
  nuevo: { label: "Nuevo", className: "bg-blue-50 text-blue-700 border-blue-200" },
  en_revision: { label: "En revisión", className: "bg-slate-100 text-slate-700 border-slate-200" },
  entrevista: { label: "Entrevista", className: "bg-purple-50 text-purple-700 border-purple-200" },
  evaluacion: { label: "Evaluación", className: "bg-amber-50 text-amber-700 border-amber-200" },
  oferta: { label: "Oferta", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  contratado: { label: "Contratado", className: "bg-green-100 text-green-800 border-green-200" },
  descartado: { label: "Descartado", className: "bg-red-50 text-red-700 border-red-200" },
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function CandidatosTable({
  candidatos,
  isLoading,
  onView,
  onScheduleInterview,
  onChangeStatus,
  onDelete,
}: CandidatosTableProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!candidatos || candidatos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FileText className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-sm font-medium">Sin candidatos</p>
        <p className="text-xs mt-1">Las candidaturas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-slate-100">
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Candidato
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Puesto
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Departamento
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Estado
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Experiencia
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Fuente
          </TableHead>
          <TableHead className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Fecha
          </TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidatos.map((candidato, index) => {
          const estadoConfig = ESTADOS[candidato.estado] || ESTADOS.nuevo;
          return (
            <TableRow
              key={candidato.id}
              className={cn(
                "group cursor-pointer transition-colors",
                index % 2 === 0 ? "bg-white" : "bg-slate-50/30",
                "hover:bg-indigo-50/50"
              )}
              onClick={() => onView(candidato)}
            >
              {/* Candidato - Nombre, Email, Teléfono */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-slate-600">
                      {getInitials(candidato.nombre)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {candidato.nombre}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="truncate">{candidato.email}</span>
                      {candidato.telefono && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-0.5">
                            <Phone className="h-3 w-3" />
                            {candidato.telefono}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Puesto solicitado y actual */}
              <TableCell>
                <p className="text-sm text-slate-900">{candidato.puesto_solicitado}</p>
                {candidato.puesto_actual && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Actual: {candidato.puesto_actual}
                  </p>
                )}
              </TableCell>

              {/* Departamento */}
              <TableCell>
                {candidato.departamento ? (
                  <Badge variant="outline" className="text-xs font-normal">
                    {candidato.departamento}
                  </Badge>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </TableCell>

              {/* Estado */}
              <TableCell>
                <Badge className={cn("border font-normal", estadoConfig.className)}>
                  {estadoConfig.label}
                </Badge>
              </TableCell>

              {/* Experiencia y Salario */}
              <TableCell>
                <p className="text-sm text-slate-900">
                  {candidato.anos_experiencia !== null
                    ? `${candidato.anos_experiencia} años`
                    : "-"}
                </p>
                {candidato.salario_esperado && (
                  <p className="text-xs text-emerald-600 mt-0.5">
                    {formatCurrency(candidato.salario_esperado)}
                  </p>
                )}
              </TableCell>

              {/* Fuente */}
              <TableCell>
                {candidato.fuente ? (
                  <Badge variant="secondary" className="text-xs font-normal bg-slate-100">
                    {candidato.fuente}
                  </Badge>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </TableCell>

              {/* Fecha */}
              <TableCell>
                <p className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(candidato.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </TableCell>

              {/* Acciones */}
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(candidato)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {candidato.cv_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(candidato.cv_url!, "_blank")}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  {candidato.linkedin_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(candidato.linkedin_url!, "_blank")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onScheduleInterview(candidato)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Programar entrevista
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(candidato, "en_revision")}
                        disabled={candidato.estado === "en_revision"}
                      >
                        En revisión
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(candidato, "entrevista")}
                        disabled={candidato.estado === "entrevista"}
                      >
                        Entrevista
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(candidato, "evaluacion")}
                        disabled={candidato.estado === "evaluacion"}
                      >
                        Evaluación
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(candidato, "oferta")}
                        disabled={candidato.estado === "oferta"}
                      >
                        Oferta
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(candidato, "contratado")}
                        disabled={candidato.estado === "contratado"}
                      >
                        Contratado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onChangeStatus(candidato, "descartado")}
                        disabled={candidato.estado === "descartado"}
                      >
                        Descartado
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(candidato)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
