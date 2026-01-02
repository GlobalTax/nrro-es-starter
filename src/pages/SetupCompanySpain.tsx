import { LandingLayout } from '@/components/layout/LandingLayout';
import { HeroWithFormSection } from '@/components/company-setup/HeroWithFormSection';
import { QuickFactsBar } from '@/components/company-setup/QuickFactsBar';
import { CompanyTypesSection } from '@/components/company-setup/CompanyTypesSection';
import { CostComparisonSection } from '@/components/company-setup/CostComparisonSection';
import { GuaranteesSection } from '@/components/company-setup/GuaranteesSection';
import { StickyMobileCTA } from '@/components/company-setup/StickyMobileCTA';
import { TrustBarSection } from '@/components/landing-sections/TrustBarSection';
import { ProblemStatementSection } from '@/components/landing-sections/ProblemStatementSection';
import { ServicesGridSection } from '@/components/landing-sections/ServicesGridSection';
import { ClientLogosCarouselSection } from '@/components/landing-sections/ClientLogosCarouselSection';
import { ProcessStepsSection } from '@/components/landing-sections/ProcessStepsSection';
import { TestimonialsSection } from '@/components/landing-sections/TestimonialsSection';
import { FAQSection } from '@/components/landing-sections/FAQSection';
import { CTAFinalSection } from '@/components/landing-sections/CTAFinalSection';
import { ContactFormSection } from '@/components/landing-sections/ContactFormSection';
import { Meta } from '@/components/seo/Meta';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { BASE_DOMAIN } from '@/lib/seoUtils';
import { Building2, Calculator, FileCheck, Landmark } from 'lucide-react';

export const SetupCompanySpain = () => {
  const heroData = {
    badge: "Trusted by 300+ International Companies",
    title: "Set Up Your Company in Spain",
    subtitle: "Strategic legal and tax guidance for entrepreneurs, foreign investors, and international groups establishing operations in Spain. From incorporation to ongoing compliance.",
    trustPoints: [
      "+70 lawyers & advisors at your service",
      "Full legal, tax & corporate support",
      "100% remote process available"
    ],
    formTitle: "Get Your Free Consultation",
    formSubtitle: "Average response time: 2 hours"
  };

  const trustBarStats = [
    { 
      value: '300+', 
      label: 'Companies Established',
      description: 'Successful company formations across Spain supporting international entrepreneurs'
    },
    { 
      value: '15+', 
      label: 'Years Experience',
      description: 'Specialized expertise in Spanish corporate law and business setup procedures'
    },
    { 
      value: '50+', 
      label: 'Countries Served',
      description: 'International clients from Europe, Americas, Asia and beyond trust our services'
    },
    { 
      value: '98%', 
      label: 'Client Satisfaction',
      description: 'Exceptional service quality with dedicated support throughout the entire process'
    }
  ];

  const problemStatement = {
    title: "Navigating Spain's Corporate Framework",
    description: "Establishing a company in Spain involves navigating complex corporate, tax and compliance frameworks. From selecting the right legal structure to understanding fiscal obligations and ongoing requirements, international investors need specialized guidance to ensure proper incorporation and optimize their operations.",
    challenges: [
      "Understanding Spanish corporate law and optimal legal structures",
      "Navigating tax implications and cross-border considerations",
      "Meeting ongoing compliance, bookkeeping and regulatory requirements",
      "Coordinating with Spanish authorities and financial institutions"
    ]
  };

  const services = [
    {
      icon: Building2,
      title: "Company Incorporation",
      description: "Drafting of bylaws, articles, shareholder structures and corporate documentation tailored to your business needs.",
      features: [
        "Legal structure selection",
        "Corporate documentation",
        "Shareholder agreements",
        "Bylaws drafting"
      ]
    },
    {
      icon: Calculator,
      title: "Tax & Fiscal Structuring",
      description: "Optimized tax planning adapted to activity, ownership and international structure for maximum efficiency.",
      features: [
        "Tax optimization strategies",
        "Cross-border structuring",
        "Fiscal planning",
        "International taxation"
      ]
    },
    {
      icon: FileCheck,
      title: "Registered Office & Compliance",
      description: "Ongoing support including bookkeeping, payroll, VAT, corporate books, and resolutions to keep you compliant.",
      features: [
        "Registered office services",
        "Bookkeeping & accounting",
        "Payroll management",
        "VAT compliance"
      ]
    },
    {
      icon: Landmark,
      title: "Banking, NIE & Documentation",
      description: "We assist throughout the private process of opening accounts and obtaining documentation—without acting as public institutions.",
      features: [
        "Bank account setup guidance",
        "NIE documentation support",
        "Power of attorney",
        "Administrative coordination"
      ]
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Initial Consultation",
      description: "We analyze your business objectives, structure needs, and cross-border considerations to provide tailored advice.",
      duration: "1-2 days"
    },
    {
      number: 2,
      title: "Corporate Planning",
      description: "Design of the optimal legal and tax structure, including shareholder agreements and governance framework.",
      duration: "1 week"
    },
    {
      number: 3,
      title: "Drafting of Documents",
      description: "Preparation of all corporate documentation, bylaws, articles of association, and required legal instruments.",
      duration: "1-2 weeks"
    },
    {
      number: 4,
      title: "Appointment & Incorporation",
      description: "We coordinate the notarial appointment, signature of documents, and formal registration procedures.",
      duration: "2-3 weeks"
    },
    {
      number: 5,
      title: "Post-incorporation Support",
      description: "Ongoing assistance with compliance, bookkeeping, banking, tax filings, and corporate governance.",
      duration: "Continuous"
    }
  ];

  const testimonials = [
    {
      quote: "Navarro's team made our Spanish expansion seamless. Their expertise in cross-border structuring was invaluable.",
      author: "James Patterson",
      position: "CEO",
      company: "Tech Ventures Ltd",
      country: "🇬🇧 United Kingdom"
    },
    {
      quote: "Professional, responsive, and highly knowledgeable. They guided us through every step of setting up our subsidiary in Barcelona.",
      author: "Marie Laurent",
      position: "CFO",
      company: "InvestCorp SA",
      country: "🇫🇷 France"
    },
    {
      quote: "The tax structuring advice saved us significant costs. Their international focus is exactly what we needed.",
      author: "Thomas Mueller",
      position: "Managing Partner",
      company: "Global Assets GmbH",
      country: "🇩🇪 Germany"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to set up a company in Spain?",
      answer: "The typical timeline is 4-6 weeks from initial consultation to full incorporation. This includes corporate planning, document drafting, notarial appointments, and registration. Express procedures can be arranged for urgent cases."
    },
    {
      question: "Can foreign shareholders create a company?",
      answer: "Yes, absolutely. Spain welcomes foreign investment and there are no restrictions on foreign ownership of Spanish companies. We specialize in assisting international investors with cross-border structuring."
    },
    {
      question: "What is the minimum capital required?",
      answer: "For a Sociedad Limitada (SL), the most common structure, the minimum capital is €3,000. For a Sociedad Anónima (SA), it's €60,000. We help you choose the right structure based on your needs."
    },
    {
      question: "What documents are required?",
      answer: "Requirements include valid passports or ID cards for all shareholders and directors, proof of address, and in some cases apostilled documents. We provide a complete checklist and assist with document preparation and legalization."
    },
    {
      question: "Do directors need to reside in Spain?",
      answer: "No, directors don't need to be Spanish residents. However, having a registered office address in Spain is mandatory, and we provide registered office services as part of our comprehensive support."
    },
    {
      question: "What are ongoing tax obligations?",
      answer: "Spanish companies must file quarterly VAT returns, annual corporate tax returns, and maintain proper accounting records. We provide full ongoing compliance support including bookkeeping, payroll, and tax filings."
    },
    {
      question: "Can I complete the process remotely?",
      answer: "Yes, the entire incorporation process can be completed remotely using powers of attorney. You don't need to travel to Spain. We handle all in-person requirements on your behalf."
    }
  ];

  const ctaFinal = {
    title: "Ready to Start Your Project in Spain?",
    description: "Schedule a consultation with our legal and tax advisors to discuss your company setup needs.",
    primaryCta: {
      text: "Schedule Consultation",
      url: "#contacto"
    },
    secondaryCta: {
      text: "Call Us Now",
      url: "tel:+34931222888"
    }
  };

  return (
    <LandingLayout>
      <Meta
        title="Set Up a Company in Spain | Expert Legal & Tax Advisors | Navarro"
        description="Set up your company in Spain with expert legal and tax advisors. Company incorporation, tax structuring, compliance support for entrepreneurs and foreign investors."
        keywords="set up company spain, incorporate spain, spain company formation, form company spain, start operations spain, spanish company setup, business registration spain"
        canonicalUrl={`${BASE_DOMAIN}/en/set-up-company-spain`}
        slugs={{
          es: '/crear-empresa-espana',
          ca: '/ca/crear-empresa-espanya',
          en: '/en/set-up-company-spain'
        }}
      />
      <FAQSchema faqs={faqs} />

      {/* Hero with integrated form */}
      <HeroWithFormSection {...heroData} />
      
      {/* Quick Facts Bar */}
      <QuickFactsBar />
      
      {/* Trust Stats */}
      <TrustBarSection overline="Our Impact" stats={trustBarStats} />
      
      {/* Problem Statement */}
      <ProblemStatementSection {...problemStatement} />
      
      {/* Company Types Comparison */}
      <CompanyTypesSection />
      
      {/* Services Grid */}
      <ServicesGridSection 
        title="What We Do"
        subtitle="Our Services"
        services={services}
      />
      
      {/* Cost Comparison: Spain vs Other Countries */}
      <CostComparisonSection />
      
      {/* Client Logos */}
      <ClientLogosCarouselSection />
      
      {/* Process Steps */}
      <ProcessStepsSection
        title="Our Process"
        subtitle="How We Work"
        steps={processSteps}
      />
      
      {/* Guarantees Section */}
      <GuaranteesSection />
      
      {/* Testimonials with flags */}
      <TestimonialsSection
        title="What Our Clients Say"
        subtitle="Trusted by entrepreneurs and investors worldwide"
        testimonials={testimonials}
      />
      
      {/* FAQ */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about setting up a company in Spain"
        faqs={faqs}
      />
      
      {/* Final CTA */}
      <CTAFinalSection {...ctaFinal} />
      
      {/* Contact Form */}
      <ContactFormSection
        title="Get Started Today"
        subtitle="Fill out the form below and our team will contact you within 24 hours"
        landingVariant="company-setup-spain"
      />
      
      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </LandingLayout>
  );
};
