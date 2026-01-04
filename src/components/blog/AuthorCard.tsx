import { Link } from "react-router-dom";
import { Linkedin, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthorInfo } from "@/hooks/useAuthorInfo";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthorCardProps {
  authorName: string | null;
  specialization?: string | null;
}

export const AuthorCard = ({ authorName, specialization }: AuthorCardProps) => {
  const { t } = useLanguage();
  const { data: author, isLoading } = useAuthorInfo(authorName);

  if (isLoading || !author) {
    // Fallback card when author not found in team_members
    if (!authorName) return null;
    
    return (
      <div className="bg-muted/50 rounded-lg p-6 mt-12">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {authorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{t('blog.writtenBy')}</p>
            <h4 className="font-semibold text-lg">{authorName}</h4>
            {specialization && (
              <p className="text-muted-foreground text-sm">{specialization}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-6 mt-12">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Avatar className="h-20 w-20 border-2 border-border">
          <AvatarImage src={author.avatar_url || undefined} alt={author.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{t('blog.writtenBy')}</p>
          <h4 className="font-semibold text-lg">{author.name}</h4>
          <p className="text-muted-foreground text-sm mb-3">
            {author.position || specialization}
          </p>
          {author.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {author.bio}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/equipo">
                {t('blog.viewProfile')}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            {author.linkedin && (
              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
