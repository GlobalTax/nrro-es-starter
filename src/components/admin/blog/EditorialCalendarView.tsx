import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar, CalendarDays, Check, Clock, FileText, Loader2, Plus, RefreshCw } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAddToQueue } from "@/hooks/useBlogAutomation";

interface CalendarEvent {
  id: string;
  event_name: string;
  event_date: string;
  recurrence: string;
  suggested_topic_template: string | null;
  suggested_category: string | null;
  days_before_publish: number;
  suggested_publish_date: string;
  suggested_topic: string;
  is_upcoming: boolean;
  days_until_event: number;
  days_until_publish: number;
  has_coverage: boolean;
  related_posts: Array<{ title_es: string; category: string }>;
}

export function EditorialCalendarView() {
  const [showAll, setShowAll] = useState(false);
  const addToQueue = useAddToQueue();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["editorial-calendar", showAll],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-editorial-calendar", {
        body: { daysAhead: showAll ? 365 : 60, includeAll: showAll },
      });

      if (error) throw error;
      return data as { events: CalendarEvent[]; total: number; uncovered: number };
    },
  });

  const handleAddToQueue = (event: CalendarEvent) => {
    if (!event.suggested_topic) return;
    addToQueue.mutate({
      topic: event.suggested_topic,
      category: event.suggested_category || "Fiscal",
    });
  };

  const getUrgencyBadge = (daysUntilPublish: number) => {
    if (daysUntilPublish < 0) {
      return <Badge variant="destructive">Pasado</Badge>;
    }
    if (daysUntilPublish <= 3) {
      return <Badge variant="destructive">Urgente</Badge>;
    }
    if (daysUntilPublish <= 7) {
      return <Badge className="bg-amber-500">Esta semana</Badge>;
    }
    if (daysUntilPublish <= 14) {
      return <Badge variant="secondary">Próximo</Badge>;
    }
    return <Badge variant="outline">Planificado</Badge>;
  };

  const getCoverageStatus = (event: CalendarEvent) => {
    if (event.has_coverage) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-emerald-600">
                <Check className="h-4 w-4" />
                <span className="text-xs">Cubierto</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p className="font-medium mb-1">Artículos relacionados:</p>
                {event.related_posts.map((post, i) => (
                  <p key={i} className="text-muted-foreground">
                    • {post.title_es}
                  </p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span className="text-xs">Sin cubrir</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <CardTitle>Calendario Editorial</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Ver próximos" : "Ver todo el año"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <CardDescription>
          Fechas fiscales y legales clave para planificar contenido relevante
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : data?.events && data.events.length > 0 ? (
          <>
            {/* Summary stats */}
            <div className="flex gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <span className="text-muted-foreground">Total eventos: </span>
                <span className="font-medium">{data.total}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Sin cubrir: </span>
                <span className="font-medium text-amber-600">{data.uncovered}</span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Publicar antes de</TableHead>
                  <TableHead>Urgencia</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.events.map((event) => (
                  <TableRow key={event.id} className={event.has_coverage ? "opacity-60" : ""}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{event.event_name}</p>
                        {event.suggested_topic && (
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {event.suggested_topic}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(event.event_date), "dd MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(event.suggested_publish_date), "dd MMM", { locale: es })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({event.days_until_publish > 0 ? `${event.days_until_publish}d` : "¡Ya!"})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getUrgencyBadge(event.days_until_publish)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.suggested_category || "General"}</Badge>
                    </TableCell>
                    <TableCell>{getCoverageStatus(event)}</TableCell>
                    <TableCell>
                      {!event.has_coverage && event.suggested_topic && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleAddToQueue(event)}
                                disabled={addToQueue.isPending}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Añadir a cola de generación</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay eventos próximos</p>
            <p className="text-sm">Los eventos del calendario editorial aparecerán aquí</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
