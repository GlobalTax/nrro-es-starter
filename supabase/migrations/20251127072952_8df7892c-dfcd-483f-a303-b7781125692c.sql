-- Seed data: 5 landings completas con secciones, SEO y métricas

INSERT INTO landing_pages (
  title, slug, category, status,
  meta_title, meta_description, keywords,
  primary_cta_text, primary_cta_url,
  sections, url, utm_url,
  version, health_score, view_count, conversion_count,
  is_active, created_at
) VALUES 

-- 1. Ley Beckham - Régimen Fiscal Especial
(
  'Ley Beckham - Régimen Fiscal Especial',
  'ley-beckham-regimen-especial',
  'Tax',
  'published',
  'Ley Beckham 2024 - Reduce tu Impuesto al 24% | Navarro Tax Legal',
  'Aprovecha el Régimen Especial de Impatriados (Ley Beckham). Reduce tu tipo impositivo al 24% durante 6 años. Asesoramiento experto en Barcelona.',
  ARRAY['ley beckham', 'régimen especial impatriados', 'impuestos españa', 'tax spain', 'barcelona tax'],
  'Consulta Gratuita',
  '#contacto',
  '[
    {
      "type": "hero",
      "props": {
        "title": "Reduce Your Tax Rate to 24% in Spain",
        "subtitle": "Régimen Especial de Impatriados - Ley Beckham",
        "description": "Save up to 50% on your taxes with Spain''s special tax regime for expats. Expert guidance through the entire process.",
        "image": "/hero-investment.jpg",
        "ctaText": "Check Your Eligibility",
        "ctaUrl": "#contacto"
      }
    },
    {
      "type": "trust-bar",
      "props": {
        "stats": [
          {"value": "500+", "label": "Successful Applications"},
          {"value": "24%", "label": "Flat Tax Rate"},
          {"value": "6 Years", "label": "Tax Benefits"},
          {"value": "98%", "label": "Approval Rate"}
        ]
      }
    },
    {
      "type": "value-props",
      "props": {
        "title": "Why Choose Ley Beckham?",
        "items": [
          {
            "icon": "TrendingDown",
            "title": "Massive Tax Savings",
            "description": "Flat 24% tax rate vs progressive rates up to 47%"
          },
          {
            "icon": "Calendar",
            "title": "6-Year Benefits",
            "description": "Maintain the special regime for 6 full tax years"
          },
          {
            "icon": "Shield",
            "title": "Expert Guidance",
            "description": "We handle all documentation and communication with tax authorities"
          },
          {
            "icon": "CheckCircle",
            "title": "Fast Process",
            "description": "Complete application in 2-4 weeks with our support"
          }
        ]
      }
    },
    {
      "type": "services-grid",
      "props": {
        "title": "Our Ley Beckham Services",
        "services": [
          {
            "title": "Eligibility Assessment",
            "description": "Free consultation to verify you meet all requirements",
            "price": "Free"
          },
          {
            "title": "Full Application",
            "description": "Complete documentation preparation and submission",
            "price": "€1,200"
          },
          {
            "title": "Annual Compliance",
            "description": "Tax declarations maintaining Ley Beckham benefits",
            "price": "From €800/year"
          }
        ]
      }
    },
    {
      "type": "process-steps",
      "props": {
        "title": "How It Works",
        "steps": [
          {
            "number": "1",
            "title": "Free Consultation",
            "description": "We review your situation and confirm eligibility"
          },
          {
            "number": "2",
            "title": "Documentation",
            "description": "We prepare all required forms and supporting documents"
          },
          {
            "number": "3",
            "title": "Submission",
            "description": "We submit to tax authorities and track your application"
          },
          {
            "number": "4",
            "title": "Approval",
            "description": "You receive confirmation and start enjoying 24% tax rate"
          }
        ]
      }
    },
    {
      "type": "testimonials",
      "props": {
        "title": "Success Stories",
        "testimonials": [
          {
            "text": "Navarro Tax Legal made the Ley Beckham process incredibly smooth. I''m now saving over €30,000 per year in taxes.",
            "author": "Michael R.",
            "position": "Tech Executive",
            "avatar": "/placeholder.svg"
          },
          {
            "text": "Professional, efficient, and always responsive. They handled everything while I focused on my new job.",
            "author": "Sarah L.",
            "position": "Financial Director",
            "avatar": "/placeholder.svg"
          }
        ]
      }
    },
    {
      "type": "faq",
      "props": {
        "title": "Frequently Asked Questions",
        "faqs": [
          {
            "question": "Who is eligible for Ley Beckham?",
            "answer": "You must not have been a Spanish tax resident in the past 10 years, move to Spain for work, and start within 12 months of arrival."
          },
          {
            "question": "How much can I save?",
            "answer": "Savings depend on your income. For €100k salary, you could save €20k-25k per year compared to standard progressive rates."
          },
          {
            "question": "How long does approval take?",
            "answer": "Typically 6-8 weeks from submission. We expedite by ensuring perfect documentation."
          },
          {
            "question": "Can I include foreign income?",
            "answer": "Yes, under Ley Beckham you only pay tax on Spanish-sourced income. Foreign income is tax-exempt (with some exceptions)."
          },
          {
            "question": "What happens after 6 years?",
            "answer": "You return to standard progressive tax rates. We help you plan for this transition."
          },
          {
            "question": "Is it too late if I already moved?",
            "answer": "You must apply within 6 months of starting work in Spain. Contact us immediately if you''re within this window."
          }
        ]
      }
    },
    {
      "type": "contact-form",
      "props": {
        "title": "Start Your Ley Beckham Application",
        "subtitle": "Free eligibility assessment - no obligation"
      }
    }
  ]'::jsonb,
  'https://navarrotaxlegal.com/ley-beckham-regimen-especial',
  'https://navarrotaxlegal.com/ley-beckham-regimen-especial?utm_source=navarro&utm_medium=landing&utm_campaign=ley-beckham',
  1,
  92,
  3247,
  87,
  true,
  NOW() - INTERVAL '45 days'
),

-- 2. Setup Company in Spain
(
  'Setup Company in Spain - Fast & Easy',
  'setup-company-spain',
  'Corporate',
  'published',
  'Setup Your Company in Spain in 2 Weeks | Navarro Tax Legal',
  'Complete company formation in Spain. SL incorporation, NIE, bank account, and fiscal setup. English-speaking experts in Barcelona.',
  ARRAY['company formation spain', 'setup business spain', 'incorporate spain', 'SL spain', 'barcelona business'],
  'Start Your Company',
  '#contacto',
  '[
    {
      "type": "hero",
      "props": {
        "title": "Start Your Business in Spain in 2 Weeks",
        "subtitle": "Complete Company Formation & Legal Compliance",
        "description": "We handle everything: SL incorporation, NIE, bank account, tax registration, and accounting setup. Focus on your business while we handle the bureaucracy.",
        "image": "/hero-investment.jpg",
        "ctaText": "Get Started",
        "ctaUrl": "#contacto"
      }
    },
    {
      "type": "trust-bar",
      "props": {
        "stats": [
          {"value": "800+", "label": "Companies Formed"},
          {"value": "2 Weeks", "label": "Average Timeline"},
          {"value": "100%", "label": "Success Rate"},
          {"value": "30+", "label": "Countries"}
        ]
      }
    },
    {
      "type": "value-props",
      "props": {
        "title": "Why Choose Us?",
        "items": [
          {
            "icon": "Zap",
            "title": "Fast Incorporation",
            "description": "Complete SL formation in 10-15 business days"
          },
          {
            "icon": "Globe",
            "title": "International Expertise",
            "description": "Fluent in English, specialized in foreign entrepreneurs"
          },
          {
            "icon": "FileCheck",
            "title": "Full Compliance",
            "description": "All legal, tax, and regulatory requirements covered"
          },
          {
            "icon": "Headphones",
            "title": "Ongoing Support",
            "description": "Accounting, tax declarations, and legal support included"
          }
        ]
      }
    },
    {
      "type": "services-grid",
      "props": {
        "title": "What''s Included",
        "services": [
          {
            "title": "SL Formation Package",
            "description": "Company name reservation, notary, mercantile registry, statutes",
            "price": "€1,500"
          },
          {
            "title": "NIE & Documentation",
            "description": "NIE application for directors, power of attorney, certified translations",
            "price": "€400"
          },
          {
            "title": "Tax & Banking Setup",
            "description": "CIF registration, tax authority enrollment, business bank account assistance",
            "price": "€600"
          },
          {
            "title": "First-Year Accounting",
            "description": "Monthly bookkeeping, quarterly VAT, annual tax declaration",
            "price": "€150/month"
          }
        ]
      }
    },
    {
      "type": "process-steps",
      "props": {
        "title": "Simple 4-Step Process",
        "steps": [
          {
            "number": "1",
            "title": "Discovery Call",
            "description": "We discuss your business plan and structure needs"
          },
          {
            "number": "2",
            "title": "Documentation",
            "description": "We gather required documents and prepare all paperwork"
          },
          {
            "number": "3",
            "title": "Formation",
            "description": "Notary appointment, capital deposit, registry submission"
          },
          {
            "number": "4",
            "title": "Activation",
            "description": "CIF, tax registration, bank account, ready to operate"
          }
        ]
      }
    },
    {
      "type": "testimonials",
      "props": {
        "title": "What Our Clients Say",
        "testimonials": [
          {
            "text": "Moving our tech startup to Barcelona was seamless thanks to Navarro. They handled everything while we focused on product development.",
            "author": "David K.",
            "position": "CEO, TechStartup",
            "avatar": "/placeholder.svg"
          },
          {
            "text": "Professional, fast, and transparent pricing. Our SL was ready in 12 days. Highly recommend!",
            "author": "Emma T.",
            "position": "Founder, E-commerce",
            "avatar": "/placeholder.svg"
          }
        ]
      }
    },
    {
      "type": "faq",
      "props": {
        "title": "Common Questions",
        "faqs": [
          {
            "question": "How much capital do I need?",
            "answer": "Minimum €3,000 for an SL (Sociedad Limitada). We recommend €10,000-20,000 for operational flexibility."
          },
          {
            "question": "Do I need to be in Spain?",
            "answer": "Not necessarily. We can use power of attorney for most steps, though one visit is recommended for bank account opening."
          },
          {
            "question": "What ongoing costs should I expect?",
            "answer": "Accounting (€150-300/month), social security (€300-400/month for director), corporate tax (25% on profits), and minor admin fees."
          },
          {
            "question": "Can I be the sole director and shareholder?",
            "answer": "Yes, you can own 100% and be the sole administrator. We help structure this correctly."
          },
          {
            "question": "How long until I can invoice clients?",
            "answer": "You can start invoicing as soon as you receive your CIF (tax ID), typically 2-3 weeks from start."
          },
          {
            "question": "Do you help with visas?",
            "answer": "We partner with immigration lawyers for entrepreneur and digital nomad visas. Let us know if you need this."
          },
          {
            "question": "What''s the difference between SL and Autónomo?",
            "answer": "SL offers limited liability and looks more professional. Autónomo is simpler but you''re personally liable. We advise based on your situation."
          }
        ]
      }
    },
    {
      "type": "contact-form",
      "props": {
        "title": "Ready to Start Your Company?",
        "subtitle": "Free consultation - we''ll explain everything"
      }
    }
  ]'::jsonb,
  'https://navarrotaxlegal.com/setup-company-spain',
  'https://navarrotaxlegal.com/setup-company-spain?utm_source=navarro&utm_medium=landing&utm_campaign=company-setup',
  1,
  88,
  2156,
  64,
  true,
  NOW() - INTERVAL '30 days'
),

-- 3. NIE & Residency Services
(
  'NIE & Residency Services - Fast Track',
  'nie-service-spain',
  'Legal',
  'published',
  'Get Your NIE Number Fast in Spain | Navarro Tax Legal Barcelona',
  'Express NIE application service in Barcelona. Police appointment, full documentation support, certificate delivery. Success guaranteed.',
  ARRAY['nie spain', 'nie barcelona', 'residency spain', 'foreigner id', 'spanish nie'],
  'Apply for NIE',
  '#contacto',
  '[
    {
      "type": "hero",
      "props": {
        "title": "Get Your NIE Number Fast & Hassle-Free",
        "subtitle": "Express Service in Barcelona",
        "description": "We handle your NIE application from start to finish. Police appointment secured, documentation prepared, certificate delivered. 100% success rate.",
        "image": "/hero-investment.jpg",
        "ctaText": "Start Application",
        "ctaUrl": "#contacto"
      }
    },
    {
      "type": "trust-bar",
      "props": {
        "stats": [
          {"value": "2,500+", "label": "NIEs Obtained"},
          {"value": "7-10 Days", "label": "Average Timeline"},
          {"value": "100%", "label": "Success Rate"},
          {"value": "5★", "label": "Client Rating"}
        ]
      }
    },
    {
      "type": "value-props",
      "props": {
        "title": "Why Our NIE Service?",
        "items": [
          {
            "icon": "Clock",
            "title": "Fast Appointment",
            "description": "We secure police appointments within days, not months"
          },
          {
            "icon": "FileText",
            "title": "Complete Documentation",
            "description": "We prepare all forms and supporting documents correctly"
          },
          {
            "icon": "UserCheck",
            "title": "Personal Accompaniment",
            "description": "We attend the police appointment with you (optional)"
          },
          {
            "icon": "Award",
            "title": "Success Guaranteed",
            "description": "100% approval rate - we get it right the first time"
          }
        ]
      }
    },
    {
      "type": "services-grid",
      "props": {
        "title": "Our NIE Services",
        "services": [
          {
            "title": "NIE Application",
            "description": "Complete service: appointment, documentation, submission",
            "price": "€180"
          },
          {
            "title": "Express NIE (3-5 days)",
            "description": "Priority appointment and expedited processing",
            "price": "€350"
          },
          {
            "title": "TIE Residency Card",
            "description": "Full residency card application for EU citizens and visa holders",
            "price": "€250"
          }
        ]
      }
    },
    {
      "type": "process-steps",
      "props": {
        "title": "Simple Process",
        "steps": [
          {
            "number": "1",
            "title": "Submit Documents",
            "description": "Send us your passport and reason for NIE request"
          },
          {
            "number": "2",
            "title": "We Prepare Everything",
            "description": "Forms filled, translations ready, appointment secured"
          },
          {
            "number": "3",
            "title": "Police Appointment",
            "description": "15-minute visit to police station (we can accompany you)"
          },
          {
            "number": "4",
            "title": "Certificate Delivered",
            "description": "Receive your NIE certificate within days"
          }
        ]
      }
    },
    {
      "type": "testimonials",
      "props": {
        "title": "Client Experiences",
        "testimonials": [
          {
            "text": "I got my appointment in 3 days! The team was super helpful and made everything so easy. Highly recommend.",
            "author": "James P.",
            "position": "Remote Worker",
            "avatar": "/placeholder.svg"
          },
          {
            "text": "Professional and efficient. They handled everything - I just showed up to the appointment with the documents they prepared.",
            "author": "Sophie M.",
            "position": "Student",
            "avatar": "/placeholder.svg"
          }
        ]
      }
    },
    {
      "type": "faq",
      "props": {
        "title": "NIE Questions",
        "faqs": [
          {
            "question": "What is an NIE?",
            "answer": "NIE (Número de Identidad de Extranjero) is your foreigner identification number in Spain. You need it for almost everything: work, taxes, buying property, opening bank accounts."
          },
          {
            "question": "How long does it take?",
            "answer": "Standard service: 7-10 days total. Express service: 3-5 days. The actual police appointment takes only 15 minutes."
          },
          {
            "question": "Do I need to be in Spain?",
            "answer": "Yes, you must attend the police appointment in person. However, we can prepare everything remotely before you arrive."
          },
          {
            "question": "What documents do I need?",
            "answer": "Valid passport, reason for NIE (work contract, property purchase, etc.), and completed application form (we provide this)."
          },
          {
            "question": "Can I do it myself?",
            "answer": "Yes, but appointments are hard to get and forms must be perfect. We guarantee success and save you weeks of frustration."
          }
        ]
      }
    },
    {
      "type": "contact-form",
      "props": {
        "title": "Get Your NIE This Week",
        "subtitle": "Fast, reliable, guaranteed"
      }
    }
  ]'::jsonb,
  'https://navarrotaxlegal.com/nie-service-spain',
  'https://navarrotaxlegal.com/nie-service-spain?utm_source=navarro&utm_medium=landing&utm_campaign=nie-service',
  1,
  85,
  4892,
  142,
  true,
  NOW() - INTERVAL '60 days'
),

-- 4. Family Business Advisory
(
  'Family Business Advisory - Legacy Planning',
  'family-business-advisory',
  'Family Business',
  'published',
  'Family Business Advisory & Succession Planning | Navarro Tax Legal',
  'Expert advisory for family-owned businesses. Succession planning, governance, conflict resolution, and generational wealth transfer in Barcelona.',
  ARRAY['family business', 'succession planning', 'family governance', 'generational transfer', 'barcelona advisory'],
  'Schedule Consultation',
  '#contacto',
  '[
    {
      "type": "hero",
      "props": {
        "title": "Secure Your Family Legacy for Generations",
        "subtitle": "Expert Advisory for Family-Owned Businesses",
        "description": "Navigate succession, governance, and family dynamics with confidence. We help family businesses thrive across generations.",
        "image": "/hero-investment.jpg",
        "ctaText": "Book Consultation",
        "ctaUrl": "#contacto"
      }
    },
    {
      "type": "trust-bar",
      "props": {
        "stats": [
          {"value": "150+", "label": "Family Businesses Advised"},
          {"value": "€2B+", "label": "Assets Under Advisory"},
          {"value": "25 Years", "label": "Combined Experience"},
          {"value": "3rd Gen", "label": "Successful Transitions"}
        ]
      }
    },
    {
      "type": "value-props",
      "props": {
        "title": "Why Family Businesses Choose Us",
        "items": [
          {
            "icon": "Users",
            "title": "Succession Planning",
            "description": "Smooth leadership transitions that preserve family harmony"
          },
          {
            "icon": "Shield",
            "title": "Governance Structures",
            "description": "Family councils, protocols, and decision-making frameworks"
          },
          {
            "icon": "TrendingUp",
            "title": "Growth & Professionalization",
            "description": "Balance family values with professional management"
          },
          {
            "icon": "Scale",
            "title": "Conflict Resolution",
            "description": "Mediate family disputes before they threaten the business"
          }
        ]
      }
    },
    {
      "type": "services-grid",
      "props": {
        "title": "Our Family Business Services",
        "services": [
          {
            "title": "Family Protocol",
            "description": "Comprehensive governance document defining roles, responsibilities, and succession",
            "price": "From €8,000"
          },
          {
            "title": "Succession Planning",
            "description": "Leadership transition strategy, training next generation, exit planning",
            "price": "From €12,000"
          },
          {
            "title": "Shareholding Structure",
            "description": "Optimize ownership, voting rights, dividend policies, and share transfers",
            "price": "From €6,000"
          },
          {
            "title": "Annual Advisory",
            "description": "Ongoing support, family council facilitation, conflict mediation",
            "price": "From €2,500/year"
          }
        ]
      }
    },
    {
      "type": "process-steps",
      "props": {
        "title": "Our Approach",
        "steps": [
          {
            "number": "1",
            "title": "Family Assessment",
            "description": "Understand dynamics, goals, challenges, and current structure"
          },
          {
            "number": "2",
            "title": "Strategic Planning",
            "description": "Design governance model, succession timeline, and protocols"
          },
          {
            "number": "3",
            "title": "Implementation",
            "description": "Draft legal documents, establish councils, train next generation"
          },
          {
            "number": "4",
            "title": "Ongoing Support",
            "description": "Regular reviews, mediation, and adaptation as family evolves"
          }
        ]
      }
    },
    {
      "type": "testimonials",
      "props": {
        "title": "Success Stories",
        "testimonials": [
          {
            "text": "Navarro helped us navigate a complex succession from 2nd to 3rd generation. Their guidance preserved both our business and family relationships.",
            "author": "Carlos M.",
            "position": "3rd Generation CEO, Manufacturing",
            "avatar": "/placeholder.svg"
          },
          {
            "text": "The family protocol they created has been invaluable. It resolved long-standing conflicts and set clear expectations for everyone.",
            "author": "Isabel R.",
            "position": "Family Council Chair, Retail Group",
            "avatar": "/placeholder.svg"
          }
        ]
      }
    },
    {
      "type": "faq",
      "props": {
        "title": "Common Questions",
        "faqs": [
          {
            "question": "When should we start succession planning?",
            "answer": "Ideally 5-10 years before the planned transition. This gives time to prepare the next generation and ensure smooth handover."
          },
          {
            "question": "What is a family protocol?",
            "answer": "A formal document that defines governance rules, succession criteria, conflict resolution mechanisms, and family member rights/responsibilities."
          },
          {
            "question": "How do you handle family conflicts?",
            "answer": "We act as neutral mediators, helping families find common ground while protecting the business. Prevention through clear protocols is key."
          },
          {
            "question": "Should we bring in outside management?",
            "answer": "It depends. We help you assess when professional management makes sense while maintaining family control and values."
          },
          {
            "question": "How do you involve the next generation?",
            "answer": "Through structured mentoring, gradual responsibility increases, formal training, and participation in family councils."
          },
          {
            "question": "What about taxes in succession?",
            "answer": "We coordinate with tax specialists to minimize inheritance and gift taxes while ensuring smooth ownership transfer."
          }
        ]
      }
    },
    {
      "type": "contact-form",
      "props": {
        "title": "Secure Your Family Business Legacy",
        "subtitle": "Confidential consultation with our family business experts"
      }
    }
  ]'::jsonb,
  'https://navarrotaxlegal.com/family-business-advisory',
  'https://navarrotaxlegal.com/family-business-advisory?utm_source=navarro&utm_medium=landing&utm_campaign=family-business',
  1,
  78,
  892,
  23,
  true,
  NOW() - INTERVAL '15 days'
),

-- 5. M&A Due Diligence
(
  'M&A Due Diligence - Comprehensive Review',
  'ma-due-diligence',
  'M&A',
  'draft',
  'M&A Due Diligence Services Barcelona | Navarro Tax Legal',
  'Comprehensive legal, tax, and financial due diligence for M&A transactions. Identify risks, validate assumptions, ensure successful deals in Spain.',
  ARRAY['due diligence', 'm&a spain', 'acquisition spain', 'legal dd', 'tax dd', 'barcelona m&a'],
  'Request Proposal',
  '#contacto',
  '[
    {
      "type": "hero",
      "props": {
        "title": "Comprehensive Due Diligence for Confident Deals",
        "subtitle": "M&A Advisory in Barcelona",
        "description": "Thorough legal, tax, and financial review to identify risks and validate your acquisition. Make informed decisions with complete transparency.",
        "image": "/hero-investment.jpg",
        "ctaText": "Request Proposal",
        "ctaUrl": "#contacto"
      }
    },
    {
      "type": "trust-bar",
      "props": {
        "stats": [
          {"value": "200+", "label": "DD Projects"},
          {"value": "€1.5B", "label": "Deal Value Reviewed"},
          {"value": "15 Days", "label": "Average Timeline"},
          {"value": "95%", "label": "Issues Identified"}
        ]
      }
    },
    {
      "type": "value-props",
      "props": {
        "title": "Why Our Due Diligence?",
        "items": [
          {
            "icon": "Search",
            "title": "Deep Investigation",
            "description": "We uncover hidden risks others miss - legal, tax, and operational"
          },
          {
            "icon": "Shield",
            "title": "Risk Mitigation",
            "description": "Identify deal-breakers early and negotiate better terms"
          },
          {
            "icon": "FileCheck",
            "title": "Actionable Reports",
            "description": "Clear, prioritized findings with impact assessment and recommendations"
          },
          {
            "icon": "Users",
            "title": "Cross-Functional Team",
            "description": "Legal, tax, and financial experts working together seamlessly"
          }
        ]
      }
    },
    {
      "type": "services-grid",
      "props": {
        "title": "Our DD Services",
        "services": [
          {
            "title": "Legal Due Diligence",
            "description": "Corporate structure, contracts, litigation, IP, compliance, employment",
            "price": "From €15,000"
          },
          {
            "title": "Tax Due Diligence",
            "description": "Tax positions, contingencies, audits, transfer pricing, tax efficiency",
            "price": "From €12,000"
          },
          {
            "title": "Financial DD",
            "description": "Quality of earnings, working capital, debt, cash flow analysis (with partners)",
            "price": "From €20,000"
          },
          {
            "title": "Integration Support",
            "description": "Post-closing legal, tax structure optimization, entity reorganization",
            "price": "Custom quote"
          }
        ]
      }
    },
    {
      "type": "process-steps",
      "props": {
        "title": "Our DD Process",
        "steps": [
          {
            "number": "1",
            "title": "Kickoff & Planning",
            "description": "Define scope, access data room, create investigation plan"
          },
          {
            "number": "2",
            "title": "Investigation",
            "description": "Review documents, conduct interviews, identify issues"
          },
          {
            "number": "3",
            "title": "Preliminary Findings",
            "description": "Share critical issues immediately for deal decision-making"
          },
          {
            "number": "4",
            "title": "Final Report",
            "description": "Comprehensive report with risk assessment and recommendations"
          }
        ]
      }
    },
    {
      "type": "testimonials",
      "props": {
        "title": "Client Feedback",
        "testimonials": [
          {
            "text": "Navarro''s DD team uncovered significant tax liabilities the seller hadn''t disclosed. Saved us from a bad acquisition. Worth every euro.",
            "author": "Private Equity Partner",
            "position": "Mid-Market Fund",
            "avatar": "/placeholder.svg"
          },
          {
            "text": "Thorough, fast, and practical. Their report was instrumental in renegotiating the purchase price and structuring the deal properly.",
            "author": "M&A Director",
            "position": "Strategic Acquirer",
            "avatar": "/placeholder.svg"
          }
        ]
      }
    },
    {
      "type": "faq",
      "props": {
        "title": "Due Diligence FAQs",
        "faqs": [
          {
            "question": "How long does DD take?",
            "answer": "Typically 2-4 weeks depending on deal complexity and data room quality. We can expedite for urgent transactions."
          },
          {
            "question": "What''s the difference between legal and tax DD?",
            "answer": "Legal DD reviews contracts, compliance, and legal risks. Tax DD analyzes tax positions, contingencies, and optimization opportunities. Both are essential."
          },
          {
            "question": "Do you find issues in every deal?",
            "answer": "Yes, virtually always. The question is severity. We prioritize by deal impact so you know what matters most."
          },
          {
            "question": "Can you help negotiate after DD?",
            "answer": "Absolutely. We provide negotiation support, help draft SPA terms, and work with your lawyers to address findings."
          },
          {
            "question": "What if we''re the seller?",
            "answer": "We also conduct vendor DD (sell-side) to identify issues proactively, prepare defense files, and streamline buyer DD."
          }
        ]
      }
    },
    {
      "type": "contact-form",
      "props": {
        "title": "Discuss Your Transaction",
        "subtitle": "Confidential consultation with our M&A team"
      }
    }
  ]'::jsonb,
  'https://navarrotaxlegal.com/ma-due-diligence',
  'https://navarrotaxlegal.com/ma-due-diligence?utm_source=navarro&utm_medium=landing&utm_campaign=ma-dd',
  1,
  68,
  234,
  8,
  true,
  NOW() - INTERVAL '5 days'
);

-- Actualizar el contador de landings existentes
UPDATE landing_pages 
SET view_count = view_count + 100, 
    conversion_count = conversion_count + 5
WHERE slug = 'herencias-barcelona';