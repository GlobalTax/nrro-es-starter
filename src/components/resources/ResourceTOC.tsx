import { List } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceTOCProps {
  items: string[];
}

export const ResourceTOC = ({ items }: ResourceTOCProps) => {
  const { language } = useLanguage();

  const title = {
    es: "Contenido del documento",
    en: "Document contents",
    ca: "Contingut del document",
  };

  return (
    <div className="bg-muted/30 rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          {title[language] || title.es}
        </h2>
      </div>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
