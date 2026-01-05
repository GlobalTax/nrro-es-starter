import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if locked out
  useEffect(() => {
    if (lockoutUntil) {
      const lockoutDate = new Date(lockoutUntil);
      const now = new Date();
      
      if (now < lockoutDate) {
        const interval = setInterval(() => {
          const currentNow = new Date();
          if (currentNow >= lockoutDate) {
            setLockoutUntil(null);
            setRemainingAttempts(null);
            clearInterval(interval);
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        setLockoutUntil(null);
        setRemainingAttempts(null);
      }
    }
  }, [lockoutUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validación con Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: 'Acceso exitoso',
        description: 'Bienvenido al panel de administración',
      });
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Actualizar intentos restantes y lockout
      if (error.remainingAttempts !== undefined) {
        setRemainingAttempts(error.remainingAttempts);
      }
      
      if (error.lockoutUntil) {
        setLockoutUntil(error.lockoutUntil);
      }

      let errorMessage = 'Credenciales inválidas';
      
      if (error.message?.includes('Too many')) {
        errorMessage = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
      } else if (error.message?.includes('Access denied')) {
        errorMessage = 'Acceso denegado: No eres un usuario administrador.';
      } else if (error.message?.includes('Account disabled')) {
        errorMessage = 'Tu cuenta ha sido desactivada. Contacta al administrador.';
      }
      
      toast({
        title: 'Error de autenticación',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLockedOut = lockoutUntil && new Date(lockoutUntil) > new Date();
  const lockoutMinutes = isLockedOut 
    ? Math.ceil((new Date(lockoutUntil!).getTime() - new Date().getTime()) / 60000)
    : 0;

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo texto */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-normal lowercase text-white tracking-tight">
            nrro
          </h1>
          <p className="text-white/50 text-sm mt-2">
            Portal de Administración
          </p>
        </div>

        {/* Alertas */}
        {isLockedOut && (
          <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/30">
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Demasiados intentos fallidos. Por favor espera {lockoutMinutes} minutos.
            </AlertDescription>
          </Alert>
        )}
        
        {remainingAttempts !== null && remainingAttempts < 3 && remainingAttempts > 0 && !isLockedOut && (
          <Alert className="mb-6 bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm text-amber-200">
              Te quedan {remainingAttempts} intentos antes del bloqueo temporal.
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70 text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@nrro.es"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              required
              disabled={isLoading || isLockedOut}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70 text-sm font-medium">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              required
              disabled={isLoading || isLockedOut}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-white/20"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-white/90 font-normal h-11 mt-2" 
            disabled={isLoading || isLockedOut}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

      </div>
    </div>
  );
};
