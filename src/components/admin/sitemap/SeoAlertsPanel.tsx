import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useSeoAlerts, type SeoAlert } from "@/hooks/useSeoAlerts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const alertIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const alertColors = {
  critical: 'destructive',
  warning: 'warning',
  info: 'default'
} as const;

const alertBgColors = {
  critical: 'bg-destructive/10 border-destructive/50',
  warning: 'bg-warning/10 border-warning/50',
  info: 'bg-muted border-border'
};

interface AlertListProps {
  alerts: SeoAlert[];
  type: SeoAlert['type'];
}

const AlertList = ({ alerts, type }: AlertListProps) => {
  const Icon = alertIcons[type];
  const filteredAlerts = alerts.filter(a => a.type === type);

  if (filteredAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Icon className="w-12 h-12 mx-auto mb-2 opacity-20" />
        <p>No hay alertas de este tipo</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Alert key={alert.id} className={alertBgColors[type]}>
            <Icon className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <span>{alert.title}</span>
              <Badge variant={alertColors[type]} className="ml-2">
                {alert.pageTitle}
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-2">
              {alert.description}
              <div className="mt-2 text-xs opacity-70">
                {alert.pageUrl}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </ScrollArea>
  );
};

export const SeoAlertsPanel = () => {
  const { data: alerts, isLoading } = useSeoAlerts();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Alert className="bg-success/10 border-success/50">
        <Info className="h-4 w-4 text-success" />
        <AlertTitle>¡Todo en orden! ✓</AlertTitle>
        <AlertDescription>
          No se detectaron problemas SEO en las páginas activas.
        </AlertDescription>
      </Alert>
    );
  }

  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold">Alertas SEO</h3>
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              {criticalCount} Críticas
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="warning" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {warningCount} Advertencias
            </Badge>
          )}
          {infoCount > 0 && (
            <Badge variant="default" className="gap-1">
              <Info className="w-3 h-3" />
              {infoCount} Info
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas ({alerts.length})</TabsTrigger>
          <TabsTrigger value="critical">Críticas ({criticalCount})</TabsTrigger>
          <TabsTrigger value="warning">Advertencias ({warningCount})</TabsTrigger>
          <TabsTrigger value="info">Info ({infoCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = alertIcons[alert.type];
                return (
                  <Alert key={alert.id} className={alertBgColors[alert.type]}>
                    <Icon className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{alert.title}</span>
                      <Badge variant={alertColors[alert.type]} className="ml-2">
                        {alert.pageTitle}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      {alert.description}
                      <div className="mt-2 text-xs opacity-70">
                        {alert.pageUrl}
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="critical" className="mt-4">
          <AlertList alerts={alerts} type="critical" />
        </TabsContent>

        <TabsContent value="warning" className="mt-4">
          <AlertList alerts={alerts} type="warning" />
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <AlertList alerts={alerts} type="info" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
