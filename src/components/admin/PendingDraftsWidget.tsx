import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileEdit, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePendingDrafts } from '@/hooks/usePendingDrafts';

export function PendingDraftsWidget() {
  const { data: drafts, isLoading } = usePendingDrafts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5" />
            Borradores Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const hasDrafts = drafts && drafts.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileEdit className="h-5 w-5 text-amber-500" />
          Borradores Pendientes
          {hasDrafts && (
            <Badge variant="destructive" className="ml-1">
              {drafts.length}
            </Badge>
          )}
        </CardTitle>
        <Link to="/admin/blog">
          <Button size="sm" variant="outline" className="gap-1">
            Ver todos
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!hasDrafts ? (
          <p className="text-muted-foreground text-sm py-4 text-center">
            ✓ No hay borradores pendientes de revisión
          </p>
        ) : (
          <ul className="space-y-3">
            {drafts.slice(0, 5).map((draft) => (
              <li 
                key={draft.id} 
                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate text-sm">
                    {draft.title_es}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>
                      {formatDistanceToNow(new Date(draft.created_at), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </span>
                    {draft.category && (
                      <>
                        <span>·</span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {draft.category}
                        </Badge>
                      </>
                    )}
                  </p>
                </div>
                <Link to={`/admin/blog?edit=${draft.id}`}>
                  <Button size="sm" variant="ghost" className="shrink-0">
                    Revisar
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
