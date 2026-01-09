import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolCategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { value: null, label: 'Todas' },
  { value: 'admin', label: 'Administración' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'rrhh', label: 'RRHH' },
  { value: 'operaciones', label: 'Operaciones' },
  { value: 'cliente', label: 'Cliente' },
];

export function ToolCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: ToolCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Button
          key={cat.value ?? 'all'}
          variant={selectedCategory === cat.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(cat.value)}
          className={cn(
            "transition-all",
            selectedCategory === cat.value && "shadow-md"
          )}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
