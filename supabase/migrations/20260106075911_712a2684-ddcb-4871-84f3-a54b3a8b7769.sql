-- Actualizar servicios destacados CA con slugs (escapando apóstrofes)
UPDATE page_content 
SET content = $json${
  "overline": "Els nostres serveis rellevants",
  "services": [
    {
      "title": "Assessorament fiscal",
      "category": "Serveis Fiscals",
      "description": "Assessorem empreses i socis en totes les seves obligacions fiscals, amb visió estratègica i anticipació",
      "features": ["Planificació i optimització fiscal", "Procediment Tributari i Inspeccions davant de les diferents administracions", "Assessorament fiscal recurrent a societats i els seus socis"],
      "slug_es": "asesoramiento-fiscal",
      "slug_ca": "assessorament-fiscal",
      "slug_en": "tax-advice"
    },
    {
      "title": "Mercantil",
      "category": "Serveis Mercantils",
      "description": "Assessorament juridicosocietari per a estructures empresarials amb visió d'estabilitat i seguretat en la gestió",
      "features": ["Recurrència legal i mercantil", "Pactes de socis i reorganitzacions societàries", "Protocols familiars i govern corporatiu"],
      "slug_es": "mercantil-derecho-societario",
      "slug_ca": "mercantil-i-dret-societari",
      "slug_en": "commercial-and-corporate-law"
    },
    {
      "title": "Laboral & Comptabilitat",
      "category": "Serveis d'Externalització",
      "description": "Externalització revisió comptable i serveis d'assessorament laboral, amb enfocament de compliment normatiu",
      "features": ["Consolidació de grups i reporting financer", "Revisió de la comptabilitat adaptada a normativa", "Externalització dels serveis de confecció de nòmines i laboral"],
      "slug_es": "asesoramiento-contable-laboral",
      "slug_ca": "assessorament-comptable-i-laboral",
      "slug_en": "accounting-and-labor-consulting"
    },
    {
      "title": "Operacions M&A",
      "category": "Monitoring Services",
      "description": "Acompanyem empresaris que volen vendre o comprar una empresa. El nostre enfocament es basa en el serveis complet",
      "features": ["Valoració d'empreses i assessorament previ", "Cerca de comprador o inversor amb la màxima confidencialitat", "Assessorament a Due Diligence i negociació del contracte de compravenda"],
      "slug_es": "compraventa-empresas",
      "slug_ca": "compravenda-d-empreses",
      "slug_en": "buying-and-selling-companies"
    }
  ]
}$json$::jsonb
WHERE id = 'b81d981a-c49a-48d7-b454-c9d61bbb83ac';

-- Actualizar servicios destacados EN con slugs
UPDATE page_content 
SET content = $json${
  "overline": "Our Core Services",
  "services": [
    {
      "title": "Company Setup in Spain",
      "category": "Corporate Services",
      "description": "End-to-end company incorporation for foreign investors. From entity selection to full regulatory compliance.",
      "features": ["SL, SA, and Branch establishment", "NIE/NIF procurement for directors", "Bank account opening assistance"],
      "slug_es": "constitucion-empresa-espana",
      "slug_ca": "constitucio-empresa-espanya",
      "slug_en": "company-setup-spain"
    },
    {
      "title": "International Tax Planning",
      "category": "Tax Services",
      "description": "Strategic tax planning for multinational operations, including double taxation treaties and transfer pricing.",
      "features": ["Cross-border tax optimization", "Beckham Law advisory", "Non-resident tax compliance"],
      "slug_es": "asesoramiento-fiscal",
      "slug_ca": "assessorament-fiscal",
      "slug_en": "tax-advice"
    },
    {
      "title": "Commercial & Corporate Law",
      "category": "Legal Services",
      "description": "Comprehensive legal support for corporate governance, contracts, and cross-border transactions.",
      "features": ["Shareholder agreements", "M&A advisory", "Corporate restructuring"],
      "slug_es": "mercantil-derecho-societario",
      "slug_ca": "mercantil-i-dret-societari",
      "slug_en": "commercial-and-corporate-law"
    },
    {
      "title": "Global Payroll & Compliance",
      "category": "HR Services",
      "description": "International workforce compliance, payroll management, and labor law advisory for multinational teams.",
      "features": ["Multi-jurisdiction payroll", "Work permit processing", "Employment contracts"],
      "slug_es": "asesoramiento-contable-laboral",
      "slug_ca": "assessorament-comptable-i-laboral",
      "slug_en": "accounting-and-labor-consulting"
    }
  ]
}$json$::jsonb
WHERE id = '48ab21de-4680-4060-bce1-2fa16f4fd547'