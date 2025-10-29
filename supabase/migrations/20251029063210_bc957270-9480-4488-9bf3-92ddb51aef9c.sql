-- Security Fix Part 2: Restrict HR data access to HR managers and admins only
-- This migration replaces overly permissive RLS policies that allowed any authenticated user
-- to view sensitive employee and candidate data (including NIFs, salaries, etc.)

-- Update RLS policies for candidatos table
DROP POLICY IF EXISTS "Viewers can read candidatos" ON candidatos;
CREATE POLICY "Only HR and admins can view candidates"
ON candidatos FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for empleados table
DROP POLICY IF EXISTS "Viewers can read empleados" ON empleados;
CREATE POLICY "Only HR and admins can view employees"
ON empleados FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for nominas table
DROP POLICY IF EXISTS "Viewers can read nominas without pdf_url" ON nominas;
CREATE POLICY "Only HR and admins can view payroll records"
ON nominas FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for entrevistas table
DROP POLICY IF EXISTS "Viewers can read entrevistas" ON entrevistas;
CREATE POLICY "Only HR and admins can view interviews"
ON entrevistas FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for movimientos_mes table
DROP POLICY IF EXISTS "Viewers can read movimientos" ON movimientos_mes;
CREATE POLICY "Only HR and admins can view salary movements"
ON movimientos_mes FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for presupuestos table
DROP POLICY IF EXISTS "Viewers can read presupuestos" ON presupuestos;
CREATE POLICY "Only HR and admins can view budgets"
ON presupuestos FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for previsiones_nomina table
DROP POLICY IF EXISTS "Viewers can read previsiones" ON previsiones_nomina;
CREATE POLICY "Only HR and admins can view payroll forecasts"
ON previsiones_nomina FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for cierres_nomina table
DROP POLICY IF EXISTS "Viewers can read cierres" ON cierres_nomina;
CREATE POLICY "Only HR and admins can view payroll closures"
ON cierres_nomina FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for comparativas_nomina table
DROP POLICY IF EXISTS "Viewers can read comparativas" ON comparativas_nomina;
CREATE POLICY "Only HR and admins can view payroll comparisons"
ON comparativas_nomina FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Update RLS policies for simulaciones table
DROP POLICY IF EXISTS "All authenticated users can read simulaciones" ON simulaciones;
CREATE POLICY "Only HR and admins can view simulations"
ON simulaciones FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'hr_manager'::app_role)
);

-- Note: The policy "Interviewers can update their interviews" on entrevistas is kept
-- as it's a valid use case for interviewers to update their own interview notes