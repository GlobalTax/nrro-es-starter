import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  Users,
  FileCheck,
  Loader2,
  FileText,
  Globe,
  LayoutTemplate,
} from 'lucide-react';
import { useServicesSearch } from '@/hooks/useServicesSearch';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import {
  useCreateGeneratedPresentation,
  useGeneratePresentationPdf,
  ServiceSummary,
  TeamMemberSummary,
  CaseStudySummary,
  PRESENTATION_SECTORS,
} from '@/hooks/useGeneratedPresentations';
import { toast } from 'sonner';

interface PresentationBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 1, title: 'Configuración', icon: Building2 },
  { id: 2, title: 'Servicios', icon: Briefcase },
  { id: 3, title: 'Contenido', icon: Users },
  { id: 4, title: 'Preview', icon: FileCheck },
];

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'ca', label: 'Català' },
];

const FORMATS = [
  { value: 'horizontal', label: 'Horizontal (16:9)' },
  { value: 'vertical', label: 'Vertical (A4)' },
];

export function PresentationBuilderDialog({
  open,
  onOpenChange,
}: PresentationBuilderDialogProps) {
  const [step, setStep] = useState(1);

  // Step 1: Configuration
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [sector, setSector] = useState('');
  const [language, setLanguage] = useState('es');
  const [format, setFormat] = useState('horizontal');

  // Step 2: Services
  const [selectedServices, setSelectedServices] = useState<ServiceSummary[]>([]);

  // Step 3: Content
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMemberSummary[]>([]);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<CaseStudySummary[]>([]);
  const [includeStats, setIncludeStats] = useState(true);
  const [customIntro, setCustomIntro] = useState('');

  // Data fetching
  const { data: servicesData } = useServicesSearch({}, language);
  const { data: teamMembers } = useTeamMembers(language);
  const { data: caseStudies } = useCaseStudies({ status: 'published', language });

  // Mutations
  const createMutation = useCreateGeneratedPresentation();
  const generatePdfMutation = useGeneratePresentationPdf();

  const services = servicesData?.services || [];

  // Group services by area
  const servicesByArea = services.reduce((acc: Record<string, typeof services>, service: any) => {
    const area = service.area || 'Otros';
    if (!acc[area]) acc[area] = [];
    acc[area].push(service);
    return acc;
  }, {});

  const handleServiceToggle = (service: any) => {
    const exists = selectedServices.find((s) => s.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([
        ...selectedServices,
        {
          id: service.id,
          name: service.name,
          area: service.area,
          description: service.description,
        },
      ]);
    }
  };

  const handleTeamMemberToggle = (member: any) => {
    const exists = selectedTeamMembers.find((m) => m.id === member.id);
    if (exists) {
      setSelectedTeamMembers(selectedTeamMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedTeamMembers([
        ...selectedTeamMembers,
        {
          id: member.id,
          name: member.name,
          position: member.position,
          avatar_url: member.avatar_url,
        },
      ]);
    }
  };

  const handleCaseStudyToggle = (cs: any) => {
    const exists = selectedCaseStudies.find((c) => c.id === cs.id);
    if (exists) {
      setSelectedCaseStudies(selectedCaseStudies.filter((c) => c.id !== cs.id));
    } else {
      setSelectedCaseStudies([
        ...selectedCaseStudies,
        {
          id: cs.id,
          title: cs.title,
          client_name: cs.client_name,
          client_industry: cs.client_industry,
          results_summary: cs.results_summary,
        },
      ]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return clientName.trim().length > 0 && language && format;
      case 2:
        return selectedServices.length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    try {
      const presentation = await createMutation.mutateAsync({
        client_name: clientName,
        client_company: clientCompany || undefined,
        sector: sector || undefined,
        language,
        format,
        services_included: selectedServices,
        team_members_included: selectedTeamMembers,
        case_studies_included: selectedCaseStudies,
        include_stats: includeStats,
        custom_intro: customIntro || undefined,
      });

      // Generate PDF
      const result = await generatePdfMutation.mutateAsync(presentation.id);
      
      if (result?.pdf_url) {
        window.open(result.pdf_url, '_blank');
      }
      
      toast.success('Presentación generada correctamente');
      handleClose();
    } catch (error) {
      console.error('Error generating presentation:', error);
    }
  };

  const handleClose = () => {
    setStep(1);
    setClientName('');
    setClientCompany('');
    setSector('');
    setLanguage('es');
    setFormat('horizontal');
    setSelectedServices([]);
    setSelectedTeamMembers([]);
    setSelectedCaseStudies([]);
    setIncludeStats(true);
    setCustomIntro('');
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || generatePdfMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generar Presentación Corporativa
          </DialogTitle>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                  step === s.id
                    ? 'bg-primary text-primary-foreground'
                    : step > s.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{s.title}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          {/* Step 1: Configuration */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del contacto *</Label>
                  <Input
                    id="clientName"
                    placeholder="Ej: Juan García"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientCompany">Empresa</Label>
                  <Input
                    id="clientCompany"
                    placeholder="Ej: Acme S.L."
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESENTATION_SECTORS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma *
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LayoutTemplate className="h-4 w-4" />
                    Formato *
                  </Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecciona los servicios a incluir en la presentación ({selectedServices.length} seleccionados)
              </p>

              {Object.entries(servicesByArea).map(([area, areaServices]) => (
                <div key={area} className="space-y-2">
                  <h3 className="font-semibold text-sm text-primary">{area}</h3>
                  <div className="grid gap-2">
                    {(areaServices as any[]).map((service) => {
                      const isSelected = selectedServices.some((s) => s.id === service.id);
                      return (
                        <div
                          key={service.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleServiceToggle(service)}
                        >
                          <Checkbox checked={isSelected} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Content */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Team Members */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Equipo clave
                  </Label>
                  <Badge variant="secondary">{selectedTeamMembers.length} seleccionados</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {teamMembers?.map((member) => {
                    const isSelected = selectedTeamMembers.some((m) => m.id === member.id);
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleTeamMemberToggle(member)}
                      >
                        <Checkbox checked={isSelected} />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.position}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Case Studies */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Casos de éxito
                  </Label>
                  <Badge variant="secondary">{selectedCaseStudies.length} seleccionados</Badge>
                </div>
                <div className="grid gap-2">
                  {caseStudies?.map((cs) => {
                    const isSelected = selectedCaseStudies.some((c) => c.id === cs.id);
                    return (
                      <div
                        key={cs.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleCaseStudyToggle(cs)}
                      >
                        <Checkbox checked={isSelected} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{cs.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {cs.client_name} · {cs.client_industry}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Incluir estadísticas de la firma</Label>
                    <p className="text-xs text-muted-foreground">
                      Años de experiencia, número de clientes, etc.
                    </p>
                  </div>
                  <Switch checked={includeStats} onCheckedChange={setIncludeStats} />
                </div>

                <div className="space-y-2">
                  <Label>Introducción personalizada (opcional)</Label>
                  <Textarea
                    placeholder="Escribe un mensaje personalizado para este cliente..."
                    value={customIntro}
                    onChange={(e) => setCustomIntro(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Resumen de la presentación</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cliente</p>
                    <p className="font-medium">{clientName}</p>
                    {clientCompany && <p className="text-muted-foreground">{clientCompany}</p>}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Configuración</p>
                    <p className="font-medium">
                      {LANGUAGES.find((l) => l.value === language)?.label} ·{' '}
                      {FORMATS.find((f) => f.value === format)?.label}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Servicios incluidos ({selectedServices.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedServices.map((s) => (
                      <Badge key={s.id} variant="secondary">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedTeamMembers.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">
                      Equipo ({selectedTeamMembers.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTeamMembers.map((m) => (
                        <Badge key={m.id} variant="outline">
                          {m.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCaseStudies.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">
                      Casos de éxito ({selectedCaseStudies.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCaseStudies.map((c) => (
                        <Badge key={c.id} variant="outline">
                          {c.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${includeStats ? 'bg-green-500' : 'bg-muted'}`} />
                    <span>Estadísticas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${customIntro ? 'bg-green-500' : 'bg-muted'}`} />
                    <span>Intro personalizada</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                <FileText className="h-12 w-12 mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">
                  La presentación se generará en formato PDF y se guardará en el historial
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t px-4">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar PDF
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
