import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote?: string; // Formato nuevo
  text?: string; // Formato legacy
  author: string;
  position?: string; // Formato nuevo
  role?: string; // Formato legacy
  company?: string;
  avatarUrl?: string;
  country?: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export const TestimonialsSection = ({ title, subtitle, testimonials }: TestimonialsSectionProps) => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal mb-4 text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {(testimonials || []).map((testimonial, index) => {
            const displayQuote = testimonial.quote || testimonial.text || '';
            const displayPosition = testimonial.position || testimonial.role || '';
            
            return (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6 italic">
                    "{displayQuote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatarUrl} />
                      <AvatarFallback>
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {displayPosition}
                      </div>
                      {testimonial.company && (
                        <div className="text-sm text-muted-foreground">
                          {testimonial.company}
                          {testimonial.country && ` • ${testimonial.country}`}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
