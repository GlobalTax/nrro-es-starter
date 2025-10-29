-- Update all RLS policies to use has_role() function instead of profiles.role
-- This allows us to remove the legacy role column

-- Empleados policies
DROP POLICY IF EXISTS "Admins can do everything with empleados" ON public.empleados;
CREATE POLICY "Admins can do everything with empleados" 
ON public.empleados 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Nominas policies  
DROP POLICY IF EXISTS "Admins can do everything with nominas" ON public.nominas;
CREATE POLICY "Admins can do everything with nominas"
ON public.nominas
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Presupuestos policies
DROP POLICY IF EXISTS "Admins can do everything with presupuestos" ON public.presupuestos;
CREATE POLICY "Admins can do everything with presupuestos"
ON public.presupuestos
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Simulaciones policies
DROP POLICY IF EXISTS "Admins can do everything with simulaciones" ON public.simulaciones;
CREATE POLICY "Admins can do everything with simulaciones"
ON public.simulaciones
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Candidatos policies
DROP POLICY IF EXISTS "Admins can do everything with candidatos" ON public.candidatos;
CREATE POLICY "Admins can do everything with candidatos"
ON public.candidatos
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Entrevistas policies
DROP POLICY IF EXISTS "Admins can do everything with entrevistas" ON public.entrevistas;
CREATE POLICY "Admins can do everything with entrevistas"
ON public.entrevistas
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Cierres nomina policies
DROP POLICY IF EXISTS "Admins can manage cierres" ON public.cierres_nomina;
CREATE POLICY "Admins can manage cierres"
ON public.cierres_nomina
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Previsiones nomina policies
DROP POLICY IF EXISTS "Admins can manage previsiones" ON public.previsiones_nomina;
CREATE POLICY "Admins can manage previsiones"
ON public.previsiones_nomina
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Movimientos mes policies
DROP POLICY IF EXISTS "Admins can manage movimientos" ON public.movimientos_mes;
CREATE POLICY "Admins can manage movimientos"
ON public.movimientos_mes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Comparativas nomina policies
DROP POLICY IF EXISTS "Admins can manage comparativas" ON public.comparativas_nomina;
CREATE POLICY "Admins can manage comparativas"
ON public.comparativas_nomina
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Now we can safely remove the role column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;