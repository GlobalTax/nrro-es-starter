import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceContentProps {
  content: string;
}

export const ResourceContent = ({ content }: ResourceContentProps) => {
  const { language } = useLanguage();

  const title = {
    es: "Sobre este recurso",
    en: "About this resource",
    ca: "Sobre aquest recurs",
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        {title[language] || title.es}
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
