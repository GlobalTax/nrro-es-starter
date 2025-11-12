import { useEffect } from "react";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  useEffect(() => {
    // Generar el schema markup
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        
        const listItem: any = {
          "@type": "ListItem",
          "position": index + 1,
        };

        if (isLastItem) {
          // Último elemento: solo name, sin item
          listItem.name = item.name;
        } else {
          // Elementos intermedios: item con @id y name
          listItem.item = {
            "@id": item.url,
            "name": item.name
          };
        }

        return listItem;
      })
    };

    // Crear o actualizar el script tag
    const scriptId = "breadcrumb-schema";
    let script = document.querySelector(`script#${scriptId}`);
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(breadcrumbSchema);

    // Cleanup: remover el script cuando el componente se desmonte
    return () => {
      const scriptToRemove = document.querySelector(`script#${scriptId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [items]);

  return null;
};
