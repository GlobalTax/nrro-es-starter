-- Add RLS policy for reading all resources
CREATE POLICY "Anyone can view active resources"
  ON public.resources
  FOR SELECT
  USING (is_active = true);

-- Insert sample resources for testing
INSERT INTO public.resources (title, description, type, category, is_featured, is_active, published_at, file_url) 
VALUES 
('Guía Fiscal para Empresas en España 2025', 'Todo lo que necesitas saber sobre obligaciones fiscales, impuestos y estrategias de planificación para empresas.', 'country_guide', 'tax', true, true, now(), 'https://example.com/guia-fiscal-2025.pdf'),
('Plantilla de Pacto de Socios', 'Modelo editable de pacto de socios para sociedades limitadas con cláusulas esenciales.', 'template', 'corporate_legal', false, true, now(), 'https://example.com/pacto-socios.docx'),
('Webinar: Sucesión en la Empresa Familiar', 'Grabación del webinar sobre planificación sucesoria y continuidad empresarial.', 'webinar', 'governance', true, true, now(), 'https://example.com/webinar-sucesion.mp4');