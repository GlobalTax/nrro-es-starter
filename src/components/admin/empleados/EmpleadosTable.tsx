import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Empleado } from '@/hooks/useEmpleados';
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Upload,
  Receipt,
  UserX,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EmpleadosTableProps {
  empleados: Empleado[] | undefined;
  isLoading: boolean;
  onView: (empleado: Empleado) => void;
  onEdit: (empleado: Empleado) => void;
  onUploadContrato: (empleado: Empleado) => void;
  onViewNominas: (empleado: Empleado) => void;
  onToggleActive: (empleado: Empleado) => void;
  onDelete: (empleado: Empleado) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const formatCurrency = (value: number | null) => {
  if (!value) return '-';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: string | null) => {
  if (!date) return '-';
  return format(new Date(date), 'dd/MM/yy', { locale: es });
};

export function EmpleadosTable({
  empleados,
  isLoading,
  onView,
  onEdit,
  onUploadContrato,
  onViewNominas,
  onToggleActive,
  onDelete,
}: EmpleadosTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600" />
      </div>
    );
  }

  if (!empleados || empleados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <UserCheck className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm font-medium">No se encontraron empleados</p>
        <p className="text-xs mt-1">Prueba ajustando los filtros</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-slate-100">
          <TableHead className="text-slate-500 font-medium">Empleado</TableHead>
          <TableHead className="text-slate-500 font-medium">Puesto</TableHead>
          <TableHead className="text-slate-500 font-medium">Estado</TableHead>
          <TableHead className="text-slate-500 font-medium text-right">Salario</TableHead>
          <TableHead className="text-slate-500 font-medium">Fechas</TableHead>
          <TableHead className="text-slate-500 font-medium w-[80px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {empleados.map((empleado, index) => (
          <TableRow
            key={empleado.id}
            className={cn(
              'group cursor-pointer transition-colors border-slate-100',
              index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30',
              'hover:bg-indigo-50/50'
            )}
            onClick={() => onView(empleado)}
          >
            {/* Avatar + Nombre/Email */}
            <TableCell>
              <div className="flex items-center gap-3">
                {empleado.avatar_url ? (
                  <img
                    src={empleado.avatar_url}
                    alt={empleado.nombre}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600">
                      {getInitials(empleado.nombre)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{empleado.nombre}</p>
                  <p className="text-sm text-slate-500">{empleado.email || '-'}</p>
                </div>
              </div>
            </TableCell>

            {/* Puesto + Departamento */}
            <TableCell>
              <p className="text-slate-900">{empleado.puesto || '-'}</p>
              <p className="text-xs text-slate-500">{empleado.departamento || '-'}</p>
            </TableCell>

            {/* Estado Badge */}
            <TableCell>
              <Badge
                className={cn(
                  'border-0',
                  empleado.activo
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                )}
              >
                {empleado.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>

            {/* Salario */}
            <TableCell className="text-right">
              <p className="font-medium text-slate-900">
                {formatCurrency(empleado.salario_base)}
              </p>
              {empleado.variable && empleado.variable > 0 && (
                <p className="text-xs text-emerald-600">
                  +{formatCurrency(empleado.variable)} var.
                </p>
              )}
            </TableCell>

            {/* Fechas */}
            <TableCell>
              <p className="text-sm text-slate-600">{formatDate(empleado.fecha_alta)}</p>
              {empleado.fecha_baja && (
                <p className="text-xs text-red-500">{formatDate(empleado.fecha_baja)}</p>
              )}
            </TableCell>

            {/* Acciones hover */}
            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(empleado);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(empleado)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUploadContrato(empleado)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir contrato
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewNominas(empleado)}>
                      <Receipt className="h-4 w-4 mr-2" />
                      Ver nóminas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onToggleActive(empleado)}>
                      {empleado.activo ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Dar de baja
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Reactivar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(empleado)}
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
        ))}
      </TableBody>
    </Table>
  );
}
