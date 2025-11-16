import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Copy, Archive, BarChart3, ExternalLink } from 'lucide-react';
import { LandingPage } from '@/hooks/useLandingPages';
import { useDeleteLandingPage } from '@/hooks/useLandingPages';

interface LandingCardProps {
  landing: LandingPage;
  onEdit: (landing: LandingPage) => void;
}

export const LandingCard = ({ landing, onEdit }: LandingCardProps) => {
  const deleteMutation = useDeleteLandingPage();
  
  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    }
  };
  
  const getStatusLabel = (status?: string | null) => {
    switch (status) {
      case 'published':
        return 'Publicada';
      case 'draft':
        return 'Borrador';
      case 'archived':
        return 'Archivada';
      default:
        return status || 'Unknown';
    }
  };
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={getStatusColor(landing.status)}>
            {getStatusLabel(landing.status)}
          </Badge>
          {!landing.is_active && (
            <Badge variant="secondary">Inactiva</Badge>
          )}
        </div>
        <CardTitle className="text-lg font-normal line-clamp-2">
          {landing.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          /{landing.slug}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Secciones:</span>
            <span className="font-medium">{landing.sections?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Visitas:</span>
            <span className="font-medium">{landing.view_count || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Conversiones:</span>
            <span className="font-medium">{landing.conversion_count || 0}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit(landing)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        {landing.status === 'published' && (
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <a href={`/${landing.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
