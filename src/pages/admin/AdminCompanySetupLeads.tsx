import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanySetupLeads, useCompanySetupStats, useUpdateCompanySetupLead, useDeleteCompanySetupLead, type LeadFilters } from '@/hooks/useCompanySetupLeads';
import { Calculator, Zap, Rocket, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const AdminCompanySetupLeads = () => {
  const [filters, setFilters] = useState<LeadFilters>({});
  const { data: leads, isLoading } = useCompanySetupLeads(filters);
  const { data: stats } = useCompanySetupStats();
  const updateLead = useUpdateCompanySetupLead();
  const deleteLead = useDeleteCompanySetupLead();
  const { toast } = useToast();

  const variantIcons = {
    calculator: Calculator,
    'nie-hell': AlertCircle,
    'tech-startup': Rocket,
    express: Zap,
  };

  const priorityColors = {
    urgent: 'destructive',
    high: 'default',
    medium: 'secondary',
    low: 'outline',
  } as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Setup Leads</h1>
        <p className="text-muted-foreground">A/B testing performance tracker</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">This month: {stats.thisMonth}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.byVariant.calculator}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">NIE Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.byVariant.nieHell}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgScore}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Search..."
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select onValueChange={(value) => setFilters({ ...filters, landing_variant: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Variants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Variants</SelectItem>
                <SelectItem value="calculator">Calculator</SelectItem>
                <SelectItem value="nie-hell">NIE Service</SelectItem>
                <SelectItem value="tech-startup">Tech Startup</SelectItem>
                <SelectItem value="express">Express</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="won">Won</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Variant</th>
                  <th className="text-left p-2">Country</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads?.map((lead) => {
                  const Icon = variantIcons[lead.landing_variant];
                  return (
                    <tr key={lead.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className="gap-1">
                          <Icon className="h-3 w-3" />
                          {lead.landing_variant}
                        </Badge>
                      </td>
                      <td className="p-2">{lead.country_origin}</td>
                      <td className="p-2">
                        <Badge variant={priorityColors[lead.priority as keyof typeof priorityColors]}>
                          {lead.priority}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <span className="font-bold">{lead.lead_score}</span>
                      </td>
                      <td className="p-2">
                        <Select
                          value={lead.status}
                          onValueChange={(value) =>
                            updateLead.mutate({
                              id: lead.id,
                              updates: { status: value },
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="won">Won</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 text-sm">{format(new Date(lead.created_at), 'MMM d')}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Delete this lead?')) {
                              deleteLead.mutate(lead.id);
                              toast({ title: 'Lead deleted' });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
