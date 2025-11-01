import { useRelatedBlogPosts } from '@/hooks/useRelatedBlogPosts';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPostCard } from './BlogPostCard';

interface RelatedBlogPostsProps {
  currentPostId: string;
  category: string;
  tags: string[];
}

export const RelatedBlogPosts = ({ currentPostId, category, tags }: RelatedBlogPostsProps) => {
  const { data: relatedPosts, isLoading } = useRelatedBlogPosts({
    currentPostId,
    category,
    tags: tags || [],
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-normal mb-8">Artículos relacionados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-normal mb-8">Artículos relacionados</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPosts.map((post: any) => (
            <BlogPostCard
              key={post.id}
              slug={post.slug_es}
              category={post.category}
              title={post.title_es}
              excerpt={post.excerpt_es}
              authorName={post.author_name}
              authorSpecialization={post.author_specialization}
              publishedAt={post.published_at}
              readTime={post.read_time}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
