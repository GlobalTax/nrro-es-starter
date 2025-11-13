import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar } from "lucide-react";
import { useSitemapHistory } from "@/hooks/useSitemapHistory";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const SitemapHistoryChart = () => {
  const { data: history, isLoading, error } = useSitemapHistory(30);

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error al cargar historial</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolución de URLs (Últimos 30 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolución de URLs (Últimos 30 días)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
          <Calendar className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">No hay datos históricos disponibles</p>
          <p className="text-xs mt-2">Los datos se registrarán automáticamente al regenerar el sitemap</p>
        </CardContent>
      </Card>
    );
  }

  // Calcular estadísticas de crecimiento
  const firstPoint = history[0];
  const lastPoint = history[history.length - 1];
  const growth = lastPoint.totalUrls - firstPoint.totalUrls;
  const growthPercent = ((growth / firstPoint.totalUrls) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolución de URLs (Últimos 30 días)
          </CardTitle>
          <div className="text-right">
            <div className="text-sm font-medium">
              {growth > 0 ? '+' : ''}{growth} URLs ({growth > 0 ? '+' : ''}{growthPercent}%)
            </div>
            <div className="text-xs text-muted-foreground">
              vs hace 30 días
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'd MMM', { locale: es })}
              className="stroke-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="stroke-muted-foreground"
              fontSize={12}
            />
            <Tooltip 
              labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: es })}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  totalUrls: 'Total URLs',
                  urlsEs: 'URLs Español',
                  urlsCa: 'URLs Català',
                  urlsEn: 'URLs English'
                };
                return [value, labels[name] || name];
              }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              formatter={(value) => {
                const labels: Record<string, string> = {
                  totalUrls: 'Total URLs',
                  urlsEs: 'Español',
                  urlsCa: 'Català',
                  urlsEn: 'English'
                };
                return labels[value] || value;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="totalUrls" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="urlsEs" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="urlsCa" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="urlsEn" 
              stroke="hsl(var(--muted-foreground))" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Leyenda adicional con stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {lastPoint.totalUrls}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Total URLs Actual</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {lastPoint.urlsEs}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Español</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {lastPoint.urlsCa}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Català</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {lastPoint.urlsEn}
            </div>
            <div className="text-xs text-muted-foreground mt-1">English</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
