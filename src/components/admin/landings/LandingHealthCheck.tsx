import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, RefreshCw } from 'lucide-react';
import { LandingPage } from '@/hooks/useLandingPages';
import { calculateHealthScore, getGradeColor, getStatusIcon } from '@/lib/landingHealthCheck';
import type { HealthCheckResult } from '@/lib/landingHealthCheck';

interface LandingHealthCheckProps {
  landing: LandingPage;
}

export const LandingHealthCheck = ({ landing }: LandingHealthCheckProps) => {
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runHealthCheck = async () => {
    setIsChecking(true);
    
    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const checkResult = calculateHealthScore(landing);
    setResult(checkResult);
    setIsChecking(false);
  };

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Health Check
          </CardTitle>
          <CardDescription>
            Verifica la salud y completitud de esta landing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runHealthCheck} 
            disabled={isChecking}
            className="w-full"
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Stethoscope className="mr-2 h-4 w-4" />
                Ejecutar Health Check
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Health Check
          </CardTitle>
          <Button 
            onClick={runHealthCheck} 
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Última verificación: {result.lastChecked.toLocaleTimeString('es-ES')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Visual */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Puntuación</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getGradeColor(result.grade)}`}>
                {result.score}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <Progress value={result.score} className="h-2" />
          <div className="flex justify-between items-center">
            <Badge variant={
              result.grade === 'excellent' ? 'default' :
              result.grade === 'good' ? 'secondary' :
              result.grade === 'fair' ? 'outline' : 'destructive'
            }>
              {result.grade === 'excellent' && 'Excelente'}
              {result.grade === 'good' && 'Bueno'}
              {result.grade === 'fair' && 'Regular'}
              {result.grade === 'poor' && 'Necesita mejoras'}
            </Badge>
          </div>
        </div>

        {/* Lista de Checks */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Verificaciones</h4>
          <div className="space-y-2">
            {result.checks.map((check, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  check.status === 'pass' ? 'bg-green-50 border-green-200' :
                  check.status === 'fail' ? 'bg-red-50 border-red-200' :
                  check.status === 'warn' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-muted border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getStatusIcon(check.status)}</span>
                      <span className="text-sm font-medium">{check.name}</span>
                    </div>
                    {check.message && (
                      <p className="text-xs text-muted-foreground mt-1 ml-6">
                        {check.message}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {check.points > 0 ? `+${check.points}` : check.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de puntos perdidos */}
        {result.score < 100 && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Puntos perdidos:</strong> {100 - result.score} pts. 
              Completa los campos faltantes para mejorar tu score.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
