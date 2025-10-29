-- Create read-only policies for hr_viewer role on sensitive HR tables

-- Empleados: HR viewers can view employees
CREATE POLICY "HR viewers can view employees"
ON public.empleados
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Nominas: HR viewers can view payroll
CREATE POLICY "HR viewers can view payroll"
ON public.nominas
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Candidatos: HR viewers can view candidates
CREATE POLICY "HR viewers can view candidates"
ON public.candidatos
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Entrevistas: HR viewers can view interviews
CREATE POLICY "HR viewers can view interviews"
ON public.entrevistas
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Cierres nomina: HR viewers can view payroll closures
CREATE POLICY "HR viewers can view payroll closures"
ON public.cierres_nomina
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Comparativas nomina: HR viewers can view payroll comparisons
CREATE POLICY "HR viewers can view payroll comparisons"
ON public.comparativas_nomina
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Previsiones nomina: HR viewers can view payroll forecasts
CREATE POLICY "HR viewers can view payroll forecasts"
ON public.previsiones_nomina
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Movimientos mes: HR viewers can view salary movements
CREATE POLICY "HR viewers can view salary movements"
ON public.movimientos_mes
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Presupuestos: HR viewers can view budgets
CREATE POLICY "HR viewers can view budgets"
ON public.presupuestos
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Simulaciones: HR viewers can view simulations
CREATE POLICY "HR viewers can view simulations"
ON public.simulaciones
FOR SELECT
USING (has_role(auth.uid(), 'hr_viewer'::app_role));

-- Log this security improvement
INSERT INTO public.security_events (
  event_type,
  severity,
  details
) VALUES (
  'ADMIN_ACTION'::security_event_type,
  'info'::event_severity,
  jsonb_build_object(
    'action', 'security_improvement',
    'description', 'Added hr_viewer role with read-only access to HR data',
    'timestamp', now()
  )
);