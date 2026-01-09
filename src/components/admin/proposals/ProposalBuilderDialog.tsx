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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Package, 
  DollarSign, 
  FileText,
  Check,
  Download,
  Loader2,
} from 'lucide-react';
import { useCreateProposal, useUpdateProposal, useProposal } from '@/hooks/useProposals';
import { useProposalServices, groupServicesByCategory, CATEGORY_LABELS, PRICE_TYPE_LABELS, ProposalService } from '@/hooks/useProposalServices';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';

interface ProposalBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId?: string | null;
}

interface SelectedService extends ProposalService {
  customPrice: number;
  quantity: number;
}

const STEPS = [
  { id: 1, label: 'Cliente', icon: User },
  { id: 2, label: 'Servicios', icon: Package },
  { id: 3, label: 'Precios', icon: DollarSign },
  { id: 4, label: 'Vista Previa', icon: FileText },
];

export function ProposalBuilderDialog({ open, onOpenChange, proposalId }: ProposalBuilderDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  
  const { data: services } = useProposalServices();
  const { data: existingProposal } = useProposal(proposalId || undefined);
  const createProposal = useCreateProposal();
  const updateProposal = useUpdateProposal();

  // Load existing proposal data
  useEffect(() => {
    if (existingProposal) {
      setClientName(existingProposal.client_name);
      setClientCompany(existingProposal.client_company || '');
      setClientEmail(existingProposal.client_email || '');
      setNotes(existingProposal.notes || '');
      setValidUntil(existingProposal.valid_until || format(addDays(new Date(), 30), 'yyyy-MM-dd'));
      // Load selected services with custom prices
      if (existingProposal.services) {
        setSelectedServices(existingProposal.services as SelectedService[]);
      }
    }
  }, [existingProposal]);

  const resetForm = () => {
    setCurrentStep(1);
    setClientName('');
    setClientCompany('');
    setClientEmail('');
    setSelectedServices([]);
    setNotes('');
    setValidUntil(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleServiceToggle = (service: ProposalService, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, {
        ...service,
        customPrice: service.default_price || 0,
        quantity: 1,
      }]);
    } else {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    }
  };

  const updateServicePrice = (serviceId: string, price: number) => {
    setSelectedServices(prev => 
      prev.map(s => s.id === serviceId ? { ...s, customPrice: price } : s)
    );
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    setSelectedServices(prev => 
      prev.map(s => s.id === serviceId ? { ...s, quantity: Math.max(1, quantity) } : s)
    );
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + (s.customPrice * s.quantity), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const groupedServices = services ? groupServicesByCategory(services) : {};

  const handleSubmit = async () => {
    const proposalData = {
      client_name: clientName,
      client_company: clientCompany || undefined,
      client_email: clientEmail || undefined,
      services: selectedServices,
      fees: selectedServices.reduce((acc, s) => ({
        ...acc,
        [s.id]: { price: s.customPrice, quantity: s.quantity, type: s.price_type }
      }), {}),
      total_amount: calculateTotal(),
      valid_until: validUntil,
      notes: notes || undefined,
    };

    if (proposalId) {
      await updateProposal.mutateAsync({ id: proposalId, ...proposalData });
    } else {
      await createProposal.mutateAsync(proposalData);
    }
    
    handleClose();
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal-pdf', {
        body: {
          client_name: clientName,
          client_company: clientCompany,
          client_email: clientEmail,
          services: selectedServices,
          total_amount: calculateTotal(),
          valid_until: validUntil,
          notes,
        },
      });

      if (error) throw error;

      // Open PDF in new tab
      if (data?.pdf_url) {
        window.open(data.pdf_url, '_blank');
        toast.success('PDF generado correctamente');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return clientName.trim().length > 0;
      case 2: return selectedServices.length > 0;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {proposalId ? 'Editar Propuesta' : 'Nueva Propuesta Comercial'}
          </DialogTitle>
        </DialogHeader>

        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-6">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-primary text-primary-foreground' : ''}
                    ${isCompleted ? 'bg-primary/20 text-primary' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>

        <Separator className="mb-6" />

        {/* Step Content */}
        <div className="min-h-[400px]">
          {/* Step 1: Client Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nombre del contacto *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nombre y apellidos"
                />
              </div>
              <div>
                <Label htmlFor="clientCompany">Empresa</Label>
                <Input
                  id="clientCompany"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="email@empresa.com"
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {Object.entries(groupedServices).map(([category, categoryServices]) => (
                <div key={category}>
                  <h3 className="font-medium mb-3">{CATEGORY_LABELS[category] || category}</h3>
                  <div className="space-y-2">
                    {categoryServices.map((service) => {
                      const isSelected = selectedServices.some(s => s.id === service.id);
                      return (
                        <div 
                          key={service.id}
                          className={`
                            flex items-center justify-between p-3 rounded-lg border
                            ${isSelected ? 'border-primary bg-primary/5' : 'border-muted'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleServiceToggle(service, !!checked)}
                            />
                            <div>
                              <p className="font-medium">{service.name}</p>
                              {service.description && (
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(service.default_price || 0)}</p>
                            <Badge variant="outline" className="text-xs">
                              {PRICE_TYPE_LABELS[service.price_type]}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Customize Prices */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Personaliza los precios y cantidades para cada servicio seleccionado
              </p>
              
              {selectedServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {PRICE_TYPE_LABELS[service.price_type]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        {service.price_type === 'monthly' && (
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">Qty:</Label>
                            <Input
                              type="number"
                              min="1"
                              value={service.quantity}
                              onChange={(e) => updateServiceQuantity(service.id, parseInt(e.target.value) || 1)}
                              className="w-16"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Precio:</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={service.customPrice}
                            onChange={(e) => updateServicePrice(service.id, parseFloat(e.target.value) || 0)}
                            className="w-28"
                          />
                          <span className="text-sm text-muted-foreground">€</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Separator />

              <div>
                <Label htmlFor="validUntil">Válida hasta</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas adicionales</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Condiciones especiales, comentarios..."
                  rows={3}
                />
              </div>

              <Card className="bg-primary/5 border-primary">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">Total estimado</span>
                  <span className="text-2xl font-bold">{formatCurrency(calculateTotal())}</span>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de la Propuesta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                      <p className="font-medium">{clientName}</p>
                      {clientCompany && <p className="text-sm">{clientCompany}</p>}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{clientEmail || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Válida hasta</p>
                      <p className="font-medium">{validUntil}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Servicios incluidos</p>
                    <div className="space-y-2">
                      {selectedServices.map((service) => (
                        <div key={service.id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span className="font-medium">
                            {formatCurrency(service.customPrice * service.quantity)}
                            {service.price_type !== 'fixed' && (
                              <span className="text-sm text-muted-foreground ml-1">
                                /{PRICE_TYPE_LABELS[service.price_type].toLowerCase()}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notas</p>
                        <p className="text-sm">{notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Generar PDF
                </Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar Propuesta
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => currentStep === 1 ? handleClose() : setCurrentStep(prev => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancelar' : 'Anterior'}
          </Button>
          
          {currentStep < 4 && (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
