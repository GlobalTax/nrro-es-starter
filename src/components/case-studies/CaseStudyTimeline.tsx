import { CaseStudyTimelineEvent } from '@/types/caseStudy';
import { Calendar } from 'lucide-react';

interface CaseStudyTimelineProps {
  timeline: CaseStudyTimelineEvent[];
}

export const CaseStudyTimeline = ({ timeline }: CaseStudyTimelineProps) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="space-y-8">
      {timeline.map((event, index) => (
        <div key={index} className="flex gap-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full flex-shrink-0">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            {index < timeline.length - 1 && (
              <div className="w-[2px] h-full bg-border mt-4" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="text-sm font-mono text-foreground/60 mb-2">
              {event.date}
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {event.title}
            </h4>
            <p className="text-base text-foreground/70 leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
