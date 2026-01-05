INSERT INTO resources (title, description, type, category, is_featured, is_active, published_at, file_url) VALUES
-- TAX
('Checklist: 15 Deducciones Fiscales que Tu Empresa Puede Estar Perdiendo', 'Descubre las deducciones más comunes que las empresas olvidan aplicar y empieza a optimizar tu carga fiscal desde hoy.', 'template', 'tax', true, true, NOW(), 'https://example.com/placeholder.pdf'),
('Guía: Ley Beckham – Cómo Pagar Solo 24% de IRPF los Primeros 6 Años', 'Todo lo que necesitas saber sobre el régimen fiscal especial para impatriados: requisitos, beneficios y cómo solicitarlo.', 'white_paper', 'tax', true, true, NOW(), 'https://example.com/placeholder.pdf'),
('Calendario Fiscal 2025: Fechas Clave para Empresas en España', 'Planifica tu año fiscal con todas las fechas de presentación de impuestos, pagos fraccionados y obligaciones informativas.', 'template', 'tax', false, true, NOW(), 'https://example.com/placeholder.pdf'),

-- CORPORATE_LEGAL
('Guía: Cómo Constituir una Empresa en España en 2-3 Semanas', 'Paso a paso para crear tu sociedad limitada o anónima en España: documentación, costes y plazos reales.', 'country_guide', 'corporate_legal', true, true, NOW(), 'https://example.com/placeholder.pdf'),
('Plantilla: Acuerdo de Confidencialidad (NDA) para Operaciones M&A', 'Modelo profesional de NDA listo para usar en negociaciones de compraventa de empresas y due diligence.', 'template', 'corporate_legal', false, true, NOW(), 'https://example.com/placeholder.pdf'),
('Webinar: Due Diligence – Qué Revisar Antes de Comprar o Vender una Empresa', 'Grabación de nuestro webinar sobre los puntos críticos de una due diligence: legal, fiscal, laboral y financiera.', 'webinar', 'corporate_legal', false, true, NOW(), 'https://example.com/placeholder.pdf'),

-- GOVERNANCE
('White Paper: Protocolo Familiar – Cómo Evitar Conflictos en la Empresa Familiar', 'Guía completa para diseñar un protocolo familiar que proteja la continuidad del negocio y la armonía entre generaciones.', 'white_paper', 'governance', true, true, NOW(), 'https://example.com/placeholder.pdf'),

-- PAYROLL
('Guía: Costes de Contratación en España – Lo que Realmente Pagas por un Empleado', 'Desglose completo de costes laborales: salario bruto, Seguridad Social, IRPF y beneficios sociales explicados.', 'white_paper', 'payroll', false, true, NOW(), 'https://example.com/placeholder.pdf'),

-- TRANSFER_PRICING
('White Paper: Precios de Transferencia – Guía para Grupos Multinacionales en España', 'Obligaciones documentales, métodos de valoración y cómo evitar ajustes fiscales en operaciones vinculadas internacionales.', 'white_paper', 'transfer_pricing', false, true, NOW(), 'https://example.com/placeholder.pdf');