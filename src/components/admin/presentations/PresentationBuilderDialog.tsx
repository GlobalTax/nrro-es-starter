import { useState, useMemo, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
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
  ImageIcon,
  Target,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ImageUpload } from '../ImageUpload';
import { PresentationSlidePreview } from './PresentationSlidePreview';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { uploadCompanyLogo } from '@/lib/uploadCompanyLogo';
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
  PRESENTATION_TYPES,
  AUDIENCE_TYPES,
  PRESENTATION_OBJECTIVES,
  QUALITY_MODES,
  CTA_TYPES,
  calculateNarrativeScore,
} from '@/hooks/useGeneratedPresentations';
import { toast } from 'sonner';

interface PresentationBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 0, title: 'Contexto', icon: Target },
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
  const [step, setStep] = useState(0);

  // Step 0: Strategic Context (NEW)
  const [presentationType, setPresentationType] = useState('corporate');
  const [audienceType, setAudienceType] = useState('family_business');
  const [presentationObjective, setPresentationObjective] = useState('meet');
  const [qualityMode, setQualityMode] = useState('professional');

  // Step 1: Configuration
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [sector, setSector] = useState('');
  const [language, setLanguage] = useState('es');
  const [format, setFormat] = useState('horizontal');
  const [clientLogoPreview, setClientLogoPreview] = useState<string | null>(null);
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  const [ctaType, setCtaType] = useState('strategic_conversation');
  const [customTagline, setCustomTagline] = useState('');

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

  // Re-sync selected items when language changes
  useEffect(() => {
    if (selectedServices.length > 0 && services.length > 0) {
      setSelectedServices(prev => prev.map(sel => {
        const fresh = services.find((s: any) => s.id === sel.id);
        if (!fresh) return sel;
        return { ...sel, name: fresh.name, area: fresh.area, description: fresh.description, features: fresh.features || [], benefits: fresh.benefits || [] };
      }));
    }
  }, [language, services]);

  useEffect(() => {
    if (selectedTeamMembers.length > 0 && teamMembers && teamMembers.length > 0) {
      setSelectedTeamMembers(prev => prev.map(sel => {
        const fresh = teamMembers.find((m: any) => m.id === sel.id);
        if (!fresh) return sel;
        return { ...sel, position: fresh.position, bio: fresh.bio, specialization: fresh.specialization };
      }));
    }
  }, [language, teamMembers]);

  useEffect(() => {
    if (selectedCaseStudies.length > 0 && caseStudies && caseStudies.length > 0) {
      setSelectedCaseStudies(prev => prev.map(sel => {
        const fresh = caseStudies.find((c: any) => c.id === sel.id);
        if (!fresh) return sel;
        return { ...sel, title: fresh.title, results_summary: fresh.results_summary, challenge: fresh.challenge, solution: fresh.solution };
      }));
    }
  }, [language, caseStudies]);

  // Group services by area
  const servicesByArea = services.reduce((acc: Record<string, typeof services>, service: any) => {
    const area = service.area || 'Otros';
    if (!acc[area]) acc[area] = [];
    acc[area].push(service);
    return acc;
  }, {});

  // Calculate narrative score for preview
  const narrativeScore = useMemo(() => {
    return calculateNarrativeScore({
      client_name: clientName,
      services_included: selectedServices,
      team_members_included: selectedTeamMembers,
      case_studies_included: selectedCaseStudies,
      custom_intro: customIntro,
    });
  }, [clientName, selectedServices, selectedTeamMembers, selectedCaseStudies, customIntro]);

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
          features: service.features || [],
          benefits: service.benefits || [],
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
          specialization: member.specialization,
          bio: member.bio,
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
          challenge: cs.challenge,
          solution: cs.solution,
          metrics: cs.metrics,
          testimonial_text: cs.testimonial_text,
          testimonial_author: cs.testimonial_author,
        },
      ]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return presentationType && audienceType && presentationObjective;
      case 1:
        return clientName.trim().length > 0 && language && format;
      case 2:
        return selectedServices.length > 0;
      case 3:
        return true;
      case 4:
        return narrativeScore.score >= 70;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (narrativeScore.score < 70) {
      toast.error('La presentación no pasa la validación de calidad');
      return;
    }

    try {
      // Upload client logo if provided
      let clientLogoUrl: string | undefined;
      if (clientLogoFile) {
        try {
          clientLogoUrl = await uploadCompanyLogo(clientLogoFile, 'client-logos');
        } catch (error) {
          console.error('Error uploading client logo:', error);
          toast.error('Error al subir el logo del cliente');
        }
      }

      const presentation = await createMutation.mutateAsync({
        client_name: clientName,
        client_company: clientCompany || undefined,
        client_logo_url: clientLogoUrl,
        sector: sector || undefined,
        language,
        format,
        services_included: selectedServices,
        team_members_included: selectedTeamMembers,
        case_studies_included: selectedCaseStudies,
        include_stats: includeStats,
        custom_intro: customIntro || undefined,
        // Nuevos campos narrativos
        presentation_type: presentationType,
        audience_type: audienceType,
        presentation_objective: presentationObjective,
        quality_mode: qualityMode,
        cta_type: ctaType,
        cover_tagline: customTagline || undefined,
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
    setStep(0);
    setPresentationType('corporate');
    setAudienceType('family_business');
    setPresentationObjective('meet');
    setQualityMode('professional');
    setClientName('');
    setClientCompany('');
    setSector('');
    setLanguage('es');
    setFormat('horizontal');
    setClientLogoPreview(null);
    setClientLogoFile(null);
    setCtaType('strategic_conversation');
    setSelectedServices([]);
    setSelectedTeamMembers([]);
    setSelectedCaseStudies([]);
    setIncludeStats(true);
    setCustomIntro('');
    setCustomTagline('');
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || generatePdfMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generar Presentación Inteligente
          </DialogTitle>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center justify-between px-2 py-2 border-b overflow-x-auto">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  step === s.id
                    ? 'bg-primary text-primary-foreground'
                    : step > s.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
                onClick={() => step > s.id && setStep(s.id)}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{s.title}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 ${step > s.id ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          {/* Step 0: Strategic Context (NEW) */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Contexto estratégico</h3>
                <p className="text-sm text-muted-foreground">
                  Define el objetivo para adaptar automáticamente el contenido
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    ¿Qué tipo de presentación es?
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {PRESENTATION_TYPES.map((type) => (
                      <div
                        key={type.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          presentationType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setPresentationType(type.value)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            presentationType === type.value ? 'border-primary bg-primary' : 'border-muted'
                          }`}>
                            {presentationType === type.value && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>¿Quién es el destinatario?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {AUDIENCE_TYPES.map((type) => (
                      <div
                        key={type.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          audienceType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setAudienceType(type.value)}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={audienceType === type.value} />
                          <span className="text-sm">{type.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>¿Cuál es el objetivo?</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESENTATION_OBJECTIVES.map((obj) => (
                      <div
                        key={obj.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors text-center ${
                          presentationObjective === obj.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setPresentationObjective(obj.value)}
                      >
                        <span className="text-sm">{obj.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Modo de calidad</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {QUALITY_MODES.map((mode) => (
                      <div
                        key={mode.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          qualityMode === mode.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setQualityMode(mode.value)}
                      >
                        <div className="text-sm font-medium">{mode.label}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Logo del cliente (opcional)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Se mostrará en la portada junto al logo de Navarro
                </p>
                <ImageUpload
                  value={clientLogoPreview}
                  onChange={(url, file) => {
                    setClientLogoPreview(url);
                    setClientLogoFile(file);
                  }}
                  className="max-w-md"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customTagline">Tagline de portada (opcional)</Label>
                <Input
                  id="customTagline"
                  placeholder="Ej: Asesoramiento integral para la empresa familiar"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Si se deja vacío, se generará automáticamente según el tipo de presentación y audiencia
                </p>
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

              <div className="space-y-2">
                <Label>Tipo de CTA (llamada a la acción)</Label>
                <Select value={ctaType} onValueChange={setCtaType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CTA_TYPES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    Equipo clave (máx. 4 en presentación)
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
                  <p className="text-xs text-muted-foreground">
                    +5 puntos de calidad si supera 50 caracteres
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview with Quality Score */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Quality Score Card */}
              <div className={`rounded-lg p-4 border ${
                narrativeScore.score >= 70 
                  ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' 
                  : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {narrativeScore.score >= 70 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    )}
                    <span className="font-semibold">Puntuación de calidad</span>
                  </div>
                  <span className={`text-2xl font-bold ${
                    narrativeScore.score >= 70 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {narrativeScore.score}/100
                  </span>
                </div>
                <Progress value={narrativeScore.score} className="h-2 mb-3" />
                
                {narrativeScore.issues.length > 0 && (
                  <div className="space-y-1">
                    {narrativeScore.issues.map((issue, i) => (
                      <div key={i} className="text-sm flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {narrativeScore.score >= 70 && (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✓ La presentación pasa la validación de calidad
                  </p>
                )}
              </div>

              {/* Live Preview */}
              <PresentationSlidePreview
                data={{
                  client_name: clientName,
                  client_company: clientCompany || null,
                  client_logo_url: clientLogoPreview || null,
                  sector: sector || null,
                  language,
                  format,
                  services_included: selectedServices,
                  team_members_included: selectedTeamMembers,
                  case_studies_included: selectedCaseStudies,
                  include_stats: includeStats,
                  custom_intro: customIntro || null,
                  presentation_type: presentationType,
                  audience_type: audienceType,
                  presentation_objective: presentationObjective,
                  quality_mode: qualityMode,
                  cover_tagline: customTagline || null,
                  cta_type: ctaType,
                }}
              />

              {/* Collapsible summary */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-2">
                  <FileText className="h-4 w-4" />
                  Ver resumen de configuración
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4 mt-2">
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tipo</p>
                        <p className="font-medium">{PRESENTATION_TYPES.find((t) => t.value === presentationType)?.label}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Audiencia</p>
                        <p className="font-medium">{AUDIENCE_TYPES.find((t) => t.value === audienceType)?.label}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Servicios ({selectedServices.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedServices.map((s) => <Badge key={s.id} variant="secondary">{s.name}</Badge>)}
                      </div>
                    </div>
                    {selectedTeamMembers.length > 0 && (
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Equipo ({selectedTeamMembers.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedTeamMembers.map((m) => <Badge key={m.id} variant="outline">{m.name}</Badge>)}
                        </div>
                      </div>
                    )}
                    {selectedCaseStudies.length > 0 && (
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Casos ({selectedCaseStudies.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedCaseStudies.map((c) => <Badge key={c.id} variant="outline">{c.title}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t px-4">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 0 || isLoading}
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
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || narrativeScore.score < 70}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
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
