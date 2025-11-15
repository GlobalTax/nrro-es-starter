import { useEffect } from "react";

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: {
    name: string;
    url?: string;
  };
  publishedDate: string;
  modifiedDate?: string;
  imageUrl?: string;
  articleUrl: string;
  category?: string;
  tags?: string[];
}

export const ArticleSchema = ({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  imageUrl,
  articleUrl,
  category,
  tags
}: ArticleSchemaProps) => {
  useEffect(() => {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": author.name,
        ...(author.url && { "url": author.url })
      },
      "publisher": {
        "@type": "Organization",
        "name": "Navarro Tax Legal",
        "logo": {
          "@type": "ImageObject",
          "url": "https://navarrotax.legal/assets/logos/navarro-tax-legal.svg"
        }
      },
      "datePublished": publishedDate,
      ...(modifiedDate && { "dateModified": modifiedDate }),
      ...(imageUrl && {
        "image": {
          "@type": "ImageObject",
          "url": imageUrl
        }
      }),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": articleUrl
      },
      ...(category && { "articleSection": category }),
      ...(tags && tags.length > 0 && { "keywords": tags.join(", ") })
    };

    const scriptId = "article-schema";
    let script = document.querySelector(`script#${scriptId}`);
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(articleSchema);

    return () => {
      const scriptToRemove = document.querySelector(`script#${scriptId}`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, author, publishedDate, modifiedDate, imageUrl, articleUrl, category, tags]);

  return null;
};
