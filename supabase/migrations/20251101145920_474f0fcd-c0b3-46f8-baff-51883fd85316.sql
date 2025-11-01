-- Update team_members table structure to ensure all fields exist
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT;

-- Insert initial team data
INSERT INTO public.team_members (name, position, email, bio, specialization, linkedin, order_index, is_active)
VALUES
  (
    'Carlos Navarro',
    'Socio Director',
    'carlos@nrro.es',
    'Más de 25 años de experiencia en asesoría fiscal y tributaria. Experto en planificación fiscal internacional.',
    'Fiscal',
    'https://linkedin.com/in/carlos-navarro',
    1,
    true
  ),
  (
    'Laura Martínez',
    'Socia - Área Legal',
    'laura@nrro.es',
    'Abogada especializada en derecho mercantil y societario. 15 años asesorando operaciones M&A.',
    'Legal',
    'https://linkedin.com/in/laura-martinez',
    2,
    true
  ),
  (
    'Miguel Rodríguez',
    'Director Contable',
    'miguel@nrro.es',
    'Auditor de cuentas y experto en estados financieros. Especializado en empresas en crecimiento.',
    'Contable',
    'https://linkedin.com/in/miguel-rodriguez',
    3,
    true
  ),
  (
    'Ana García',
    'Responsable Laboral',
    'ana@nrro.es',
    'Graduada social con experiencia en gestión de nóminas y relaciones laborales para PYMES.',
    'Laboral',
    'https://linkedin.com/in/ana-garcia',
    4,
    true
  )
ON CONFLICT (id) DO NOTHING;