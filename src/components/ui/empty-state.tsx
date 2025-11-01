import { FileQuestion, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export const EmptyState = ({ title, description, icon: Icon = FileQuestion }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Icon className="h-16 w-16 text-subtle mb-6" strokeWidth={1.5} />
      <h3 className="text-xl font-serif mb-3">{title}</h3>
      {description && (
        <p className="text-sm text-body max-w-md leading-relaxed">{description}</p>
      )}
    </div>
  );
};
