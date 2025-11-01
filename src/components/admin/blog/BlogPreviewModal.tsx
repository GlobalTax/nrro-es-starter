import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Overline } from "@/components/ui/typography";
import DOMPurify from "dompurify";

interface BlogPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    title_es?: string;
    excerpt_es?: string;
    content_es?: string;
    category?: string;
    tags?: string[];
    featured_image?: string;
    read_time?: number;
    published_at?: string;
  };
}

export const BlogPreviewModal = ({ open, onOpenChange, post }: BlogPreviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Vista previa del artículo</DialogTitle>
            <DialogDescription>
              Visualización del contenido del artículo antes de su publicación
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cerrar Vista Previa
          </Button>
        </div>

        <article className="container mx-auto px-6 py-8">
          <div className="max-w-3xl mx-auto">
            {post.featured_image && (
              <div className="mb-8 -mx-6 sm:mx-0 sm:rounded-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title_es || ""}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            )}

            <header className="mb-12 pb-12 border-b border-border">
              {post.category && (
                <Overline className="mb-4">{post.category}</Overline>
              )}
              <h1 className="text-4xl font-bold mb-6">{post.title_es || "Sin título"}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Sin fecha"}
                </time>
                {post.read_time && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.read_time} min
                    </span>
                  </>
                )}
              </div>
            </header>

            <div className="prose-article">
              {post.excerpt_es && (
                <p className="text-xl text-muted-foreground mb-8">{post.excerpt_es}</p>
              )}
              {post.content_es ? (
                <div
                  className="text-body space-y-6"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content_es, {
                      ALLOWED_TAGS: [
                        "p",
                        "br",
                        "strong",
                        "em",
                        "u",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                        "ul",
                        "ol",
                        "li",
                        "a",
                        "img",
                        "blockquote",
                        "code",
                        "pre",
                      ],
                      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel"],
                      ALLOW_DATA_ATTR: false,
                    }),
                  }}
                />
              ) : (
                <p className="text-muted-foreground italic">Sin contenido</p>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
};
