import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePageContent } from "@/hooks/usePageContent";
import sageDashboard from "@/assets/mockups/sage-dashboard.jpg";
import a3Dashboard from "@/assets/mockups/a3-software-dashboard.jpg";
import woltersKluwer from "@/assets/mockups/wolters-kluwer.jpg";
import microsoft365 from "@/assets/mockups/microsoft-365.jpg";
import docusign from "@/assets/mockups/docusign.jpg";
import lexnet from "@/assets/mockups/lexnet.jpg";

interface TechItem {
  name: string;
  category: string;
  description: string;
  mockup_url: string;
  featured?: boolean;
}

const DEFAULT_TECH_ITEMS: TechItem[] = [
  {
    name: "Sage",
    category: "ERP Contable",
    description: "Gestión contable y financiera integral para empresas",
    mockup_url: sageDashboard,
    featured: true,
  },
  {
    name: "A3 Software",
    category: "Gestión Empresarial",
    description: "Asesoría, nóminas y gestión de recursos humanos",
    mockup_url: a3Dashboard,
    featured: true,
  },
  {
    name: "Wolters Kluwer",
    category: "Normativa Fiscal",
    description: "Base de datos legal y fiscal actualizada",
    mockup_url: woltersKluwer,
  },
  {
    name: "Microsoft 365",
    category: "Productividad",
    description: "Suite completa de herramientas empresariales",
    mockup_url: microsoft365,
  },
  {
    name: "DocuSign",
    category: "Firma Digital",
    description: "Firma electrónica segura y legalmente válida",
    mockup_url: docusign,
  },
  {
    name: "Lexnet",
    category: "Justicia Digital",
    description: "Notificaciones judiciales y gestión procesal",
    mockup_url: lexnet,
  },
];

export const TechnologyShowcase = () => {
  const { data: pageContent } = usePageContent('home', 'tecnologia');
  const items = pageContent?.[0]?.content?.technologies || DEFAULT_TECH_ITEMS;
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  // Featured items (large cards)
  const featuredItems = items.filter((item) => item.featured);
  const regularItems = items.filter((item) => !item.featured);

  return (
    <>
      <div className="grid grid-cols-12 gap-4 auto-rows-[240px] md:auto-rows-[280px]">
        {/* Large Featured Item 1 - Sage */}
        {featuredItems[0] && (
          <motion.div
            className="col-span-12 md:col-span-7 row-span-2 relative group cursor-pointer overflow-hidden rounded-xl shadow-strong"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedTech(featuredItems[0])}
          >
            <img
              src={featuredItems[0].mockup_url}
              alt={featuredItems[0].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/80 text-sm font-mono uppercase tracking-wider mb-2">
                  {featuredItems[0].category}
                </p>
                <h3 className="text-white text-3xl md:text-4xl font-normal mb-2">
                  {featuredItems[0].name}
                </h3>
                <p className="text-white/90 text-base">
                  {featuredItems[0].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Items - Top Right Stack */}
        {regularItems.slice(0, 2).map((item, idx) => (
          <motion.div
            key={idx}
            className="col-span-6 md:col-span-5 row-span-1 relative group cursor-pointer overflow-hidden rounded-xl shadow-medium bg-background border border-border"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedTech(item)}
          >
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-2">
                  {item.category}
                </p>
                <h3 className="text-foreground text-xl md:text-2xl font-normal mb-1">
                  {item.name}
                </h3>
              </div>
              <div className="w-full h-20 rounded-lg overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                <img
                  src={item.mockup_url}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Large Featured Item 2 - A3 Software */}
        {featuredItems[1] && (
          <motion.div
            className="col-span-12 md:col-span-5 row-span-2 relative group cursor-pointer overflow-hidden rounded-xl shadow-strong"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedTech(featuredItems[1])}
          >
            <img
              src={featuredItems[1].mockup_url}
              alt={featuredItems[1].name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/80 text-sm font-mono uppercase tracking-wider mb-2">
                  {featuredItems[1].category}
                </p>
                <h3 className="text-white text-2xl md:text-3xl font-normal mb-2">
                  {featuredItems[1].name}
                </h3>
                <p className="text-white/90 text-sm md:text-base">
                  {featuredItems[1].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Items - Bottom Left Stack */}
        {regularItems.slice(2, 4).map((item, idx) => (
          <motion.div
            key={idx + 2}
            className="col-span-6 md:col-span-7 lg:col-span-3 md:col-start-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-xl shadow-medium bg-background border border-border"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedTech(item)}
          >
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mb-2">
                  {item.category}
                </p>
                <h3 className="text-foreground text-lg md:text-xl font-normal mb-1">
                  {item.name}
                </h3>
              </div>
              <div className="w-full h-16 rounded-lg overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                <img
                  src={item.mockup_url}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal para ampliar mockups */}
      <Dialog open={!!selectedTech} onOpenChange={() => setSelectedTech(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background">
          {selectedTech && (
            <div className="relative">
              <img
                src={selectedTech.mockup_url}
                alt={selectedTech.name}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/95 to-transparent p-8">
                <p className="text-white/80 text-sm font-mono uppercase tracking-wider mb-2">
                  {selectedTech.category}
                </p>
                <h3 className="text-white text-3xl font-normal mb-2">
                  {selectedTech.name}
                </h3>
                <p className="text-white/90">{selectedTech.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
