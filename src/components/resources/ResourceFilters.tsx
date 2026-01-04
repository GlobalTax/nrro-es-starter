import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FileText, Video, FileCheck, Grid3X3, Globe } from "lucide-react";

interface ResourceFiltersProps {
  activeType: string;
  activeCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
}

// Based on actual enum values: country_guide, template, webinar, white_paper
const resourceTypes = [
  { id: "all", icon: Grid3X3 },
  { id: "country_guide", icon: Globe },
  { id: "template", icon: FileCheck },
  { id: "webinar", icon: Video },
  { id: "white_paper", icon: FileText },
];

// Based on actual enum values: accounting, corporate_legal, governance, payroll, tax, transfer_pricing, treasury
const categories = [
  { id: "all" },
  { id: "tax" },
  { id: "corporate_legal" },
  { id: "payroll" },
  { id: "accounting" },
  { id: "governance" },
  { id: "transfer_pricing" },
  { id: "treasury" },
];

export const ResourceFilters = ({
  activeType,
  activeCategory,
  onTypeChange,
  onCategoryChange,
}: ResourceFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Type filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {t("resources.filterByType", "Tipo de recurso")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map((type) => {
            const Icon = type.icon;
            const isActive = activeType === type.id;
            return (
              <Button
                key={type.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(type.id)}
                className={isActive ? "" : "bg-background hover:bg-muted"}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {t(`resources.types.${type.id}`, type.id === "all" ? "Todos" : type.id)}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          {t("resources.filterByCategory", "Área de práctica")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(cat.id)}
                className={isActive ? "" : "bg-background hover:bg-muted"}
              >
                {t(`resources.categories.${cat.id}`, cat.id === "all" ? "Todas" : cat.id)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
