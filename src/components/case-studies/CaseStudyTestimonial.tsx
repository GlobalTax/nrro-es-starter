import { Quote } from 'lucide-react';

interface CaseStudyTestimonialProps {
  text: string;
  author: string;
  position: string;
  avatarUrl?: string | null;
}

export const CaseStudyTestimonial = ({ 
  text, 
  author, 
  position, 
  avatarUrl 
}: CaseStudyTestimonialProps) => {
  return (
    <div className="bg-neutral-50 rounded-lg p-8 lg:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
          <Quote className="h-8 w-8 text-accent" />
        </div>
        <blockquote className="text-xl lg:text-2xl font-normal leading-relaxed text-foreground mb-8">
          "{text}"
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="text-left">
            <div className="font-medium text-foreground">{author}</div>
            <div className="text-sm text-foreground/60">{position}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
