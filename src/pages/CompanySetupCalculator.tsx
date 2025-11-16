import { useState } from 'react';
import { Meta } from '@/components/seo/Meta';
import { useTranslation } from 'react-i18next';
import { Calculator, FileText, Building2, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrustBar } from '@/components/company-setup/shared/TrustBar';
import { CompanySetupForm } from '@/components/company-setup/shared/CompanySetupForm';
import { WhyChooseUs } from '@/components/company-setup/shared/WhyChooseUs';
import { Badge } from '@/components/ui/badge';

export const CompanySetupCalculator = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [calculatorData, setCalculatorData] = useState({
    legalStructure: '',
    capitalInvestment: '',
    servicesNeeded: [] as string[],
    timeline: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const calculateCosts = () => {
    let total = 0;
    
    // Base costs by structure
    if (calculatorData.legalStructure === 'sl') total += 300; // Sociedad Limitada
    else if (calculatorData.legalStructure === 'sa') total += 500; // Sociedad Anónima
    else if (calculatorData.legalStructure === 'autonomo') total += 50;
    else if (calculatorData.legalStructure === 'sucursal') total += 400;
    
    // Capital investment fees
    const capital = parseInt(calculatorData.capitalInvestment);
    if (capital >= 60000) total += 200;
    else if (capital >= 3000) total += 100;
    
    // Additional services
    if (calculatorData.servicesNeeded.includes('nie')) total += 350;
    if (calculatorData.servicesNeeded.includes('tax')) total += 150;
    if (calculatorData.servicesNeeded.includes('bookkeeping')) total += 200;
    if (calculatorData.servicesNeeded.includes('office')) total += 500;
    
    // Our professional fees
    total += 1500; // Base professional service
    
    setEstimatedCost(total);
    setShowResults(true);
  };

  const toggleService = (service: string) => {
    setCalculatorData(prev => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter(s => s !== service)
        : [...prev.servicesNeeded, service]
    }));
  };

  return (
    <>
      <Meta
        title="Company Setup Cost Calculator Spain | Free Estimate"
        description="Calculate exact costs to open your company in Spain. Legal fees, government charges, and professional services. Get instant estimate + free guide."
      />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Free Cost Estimator
            </Badge>
            <h1 className="text-4xl md:text-5xl font-normal mb-6">
              How Much Does It Cost to Open a Company in Spain?
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get your personalized cost estimate in 2 minutes. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Calculator Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <Card>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-normal">Company Setup Calculator</h2>
                      <span className="text-sm text-muted-foreground">Step {step} of 4</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(step / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg mb-4 block">Select Legal Structure</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { value: 'sl', label: 'Sociedad Limitada (SL)', desc: 'Most common for SMEs', capital: '€3,000' },
                            { value: 'sa', label: 'Sociedad Anónima (SA)', desc: 'For larger companies', capital: '€60,000' },
                            { value: 'autonomo', label: 'Autónomo', desc: 'Self-employed', capital: 'None' },
                            { value: 'sucursal', label: 'Branch Office', desc: 'Foreign company branch', capital: 'None' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setCalculatorData(prev => ({ ...prev, legalStructure: option.value }))}
                              className={`p-4 border-2 rounded-lg text-left transition-all hover:border-primary ${
                                calculatorData.legalStructure === option.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border'
                              }`}
                            >
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-sm text-muted-foreground mt-1">{option.desc}</div>
                              <div className="text-xs text-muted-foreground mt-2">Min. capital: {option.capital}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button 
                        onClick={() => setStep(2)} 
                        disabled={!calculatorData.legalStructure}
                        className="w-full"
                      >
                        Next Step
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg mb-4 block">Capital Investment</Label>
                        <Select onValueChange={(value) => setCalculatorData(prev => ({ ...prev, capitalInvestment: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select initial capital" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3000">€3,000 (Minimum for SL)</SelectItem>
                            <SelectItem value="10000">€10,000</SelectItem>
                            <SelectItem value="25000">€25,000</SelectItem>
                            <SelectItem value="60000">€60,000 (Required for SA)</SelectItem>
                            <SelectItem value="100000">€100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                          Back
                        </Button>
                        <Button 
                          onClick={() => setStep(3)} 
                          disabled={!calculatorData.capitalInvestment}
                          className="w-full"
                        >
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg mb-4 block">Additional Services Needed</Label>
                        <div className="space-y-3">
                          {[
                            { value: 'nie', label: 'NIE (Tax ID) for founders', price: '+€350' },
                            { value: 'tax', label: 'Tax registration', price: '+€150' },
                            { value: 'bookkeeping', label: '1st year bookkeeping', price: '+€200/mo' },
                            { value: 'office', label: 'Virtual office address', price: '+€500/yr' },
                          ].map((service) => (
                            <button
                              key={service.value}
                              onClick={() => toggleService(service.value)}
                              className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-primary flex justify-between items-center ${
                                calculatorData.servicesNeeded.includes(service.value)
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border'
                              }`}
                            >
                              <span className="font-medium">{service.label}</span>
                              <span className="text-sm text-muted-foreground">{service.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(2)} variant="outline" className="w-full">
                          Back
                        </Button>
                        <Button onClick={() => setStep(4)} className="w-full">
                          Next Step
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg mb-4 block">When do you need this?</Label>
                        <Select onValueChange={(value) => setCalculatorData(prev => ({ ...prev, timeline: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="3-months">Within 3 months</SelectItem>
                            <SelectItem value="6-months">Within 6 months</SelectItem>
                            <SelectItem value="exploring">Just exploring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-4">
                        <Button onClick={() => setStep(3)} variant="outline" className="w-full">
                          Back
                        </Button>
                        <Button 
                          onClick={calculateCosts} 
                          disabled={!calculatorData.timeline}
                          className="w-full"
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          Calculate Cost
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                <WhyChooseUs />

                <Card className="border-primary">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <Euro className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h2 className="text-3xl font-normal mb-2">Your Estimated Cost</h2>
                      <div className="text-5xl font-bold text-primary">
                        €{estimatedCost.toLocaleString()}
                      </div>
                      <p className="text-muted-foreground mt-4">
                        Complete setup including all professional fees
                      </p>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      <div className="flex justify-between">
                        <span>Government & notary fees</span>
                        <span className="font-semibold">€300-500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional services</span>
                        <span className="font-semibold">€1,500</span>
                      </div>
                      {calculatorData.servicesNeeded.map(service => (
                        <div key={service} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">+ {service.toUpperCase()}</span>
                          <span>Included</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-normal mb-2">Get Your Full Cost Breakdown</h3>
                      <p className="text-muted-foreground">
                        Download detailed PDF report + Setup checklist
                      </p>
                    </div>
                    
                    <CompanySetupForm
                      landingVariant="calculator"
                      conversionType="calculator-download"
                      calculatorData={calculatorData}
                      submitButtonText="Download Full Report"
                      showAllFields={false}
                    />
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button onClick={() => { setShowResults(false); setStep(1); }} variant="ghost">
                    Start Over
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
