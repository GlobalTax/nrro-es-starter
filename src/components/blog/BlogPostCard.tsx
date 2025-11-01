import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BlogPostCardProps {
  slug: string;
  category?: string;
  title: string;
  excerpt?: string;
  authorName?: string;
  authorSpecialization?: string;
  publishedAt?: string;
  readTime?: number;
  className?: string;
}

export const BlogPostCard = ({
  slug,
  category,
  title,
  excerpt,
  authorName,
  authorSpecialization,
  publishedAt,
  readTime,
  className = "",
}: BlogPostCardProps) => {
  return (
    <Link to={`/blog/${slug}`}>
      <Card className={`h-full hover-lift transition-smooth group ${className}`}>
        <CardContent className="p-6 flex flex-col h-full">
          {/* Category Badge */}
          {category && (
            <Badge variant="secondary" className="mb-4 w-fit">
              {category}
            </Badge>
          )}

          {/* Title */}
          <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
              {excerpt}
            </p>
          )}

          {/* Footer: Author & Read Time */}
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
            <div className="flex flex-col gap-0.5">
              {authorName && (
                <p className="text-sm font-medium text-foreground">
                  {authorName}
                </p>
              )}
              {authorSpecialization && (
                <p className="text-xs text-muted-foreground">
                  {authorSpecialization}
                </p>
              )}
            </div>

            {readTime && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{readTime} min</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
