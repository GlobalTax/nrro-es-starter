import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProposals, useDeleteProposal, useProposalStats, useUpdateProposal } from '@/hooks/useProposals';
import { ProposalBuilderDialog } from '@/components/admin/proposals/ProposalBuilderDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_CONFIG = {
  draft: { label: 'Borrador', variant: 'secondary' as const, icon: Clock },
  sent: { label: 'Enviada', variant: 'default' as const, icon: Send },
  accepted: { label: 'Aceptada', variant: 'default' as const, icon: CheckCircle },
  rejected: { label: 'Rechazada', variant: 'destructive' as const, icon: XCircle },
  expired: { label: 'Expirada', variant: 'outline' as const, icon: Clock },
};

export default function AdminProposals() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<string | null>(null);
  
  const { data: proposals, isLoading } = useProposals();
  const { data: stats } = useProposalStats();
  const deleteProposal = useDeleteProposal();
  const updateProposal = useUpdateProposal();

  const filteredProposals = proposals?.filter(proposal => {
    const matchesSearch = 
      proposal.proposal_number.toLowerCase().includes(search.toLowerCase()) ||
      proposal.client_name.toLowerCase().includes(search.toLowerCase()) ||
      proposal.client_company?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateProposal.mutate({ id, status: newStatus as any });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-medium">Propuestas Comerciales</h1>
          <p className="text-muted-foreground">Genera y gestiona propuestas de honorarios</p>
        </div>
        <Button onClick={() => setIsBuilderOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Propuesta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propuestas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.draft || 0} borradores
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sent || 0}</div>
            <p className="text-xs text-muted-foreground">pendientes de respuesta</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.conversionRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.accepted || 0} aceptadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.totalValue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">propuestas aceptadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="sent">Enviadas</SelectItem>
            <SelectItem value="accepted">Aceptadas</SelectItem>
            <SelectItem value="rejected">Rechazadas</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Propuesta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Válida hasta</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Cargando propuestas...
                </TableCell>
              </TableRow>
            ) : filteredProposals?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No hay propuestas
                </TableCell>
              </TableRow>
            ) : (
              filteredProposals?.map((proposal) => {
                const statusConfig = STATUS_CONFIG[proposal.status];
                const StatusIcon = statusConfig.icon;
                
                return (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-mono font-medium">
                      {proposal.proposal_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{proposal.client_name}</p>
                        {proposal.client_company && (
                          <p className="text-sm text-muted-foreground">
                            {proposal.client_company}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {proposal.total_amount 
                        ? formatCurrency(proposal.total_amount)
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {proposal.valid_until
                        ? format(new Date(proposal.valid_until), 'dd MMM yyyy', { locale: es })
                        : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(proposal.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingProposal(proposal.id)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          {proposal.pdf_url && (
                            <DropdownMenuItem asChild>
                              <a href={proposal.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver PDF
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {proposal.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(proposal.id, 'sent')}>
                              <Send className="h-4 w-4 mr-2" />
                              Marcar como enviada
                            </DropdownMenuItem>
                          )}
                          {proposal.status === 'sent' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(proposal.id, 'accepted')}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como aceptada
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(proposal.id, 'rejected')}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Marcar como rechazada
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm('¿Eliminar esta propuesta?')) {
                                deleteProposal.mutate(proposal.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Builder Dialog */}
      <ProposalBuilderDialog
        open={isBuilderOpen || !!editingProposal}
        onOpenChange={(open) => {
          setIsBuilderOpen(open);
          if (!open) setEditingProposal(null);
        }}
        proposalId={editingProposal}
      />
    </div>
  );
}
