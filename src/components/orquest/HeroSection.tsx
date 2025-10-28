import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onViewDemo: () => void;
}

export const HeroSection = ({ onViewDemo }: HeroSectionProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        {/* Título principal */}
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6"
          {...fadeInUp}
        >
          Orquest + KairosHR: La combinación ganadora
          <span className="block mt-2">para franquiciados McDonald's</span>
        </motion.h1>
        
        {/* Subtítulo */}
        <motion.p 
          className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Planifica con inteligencia. Gestiona con seguridad. Todo bajo control.
        </motion.p>
        
        {/* CTA principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button 
            size="lg"
            onClick={onViewDemo}
            className="text-lg px-8 py-6 h-auto"
          >
            Ver demo integrada ↓
          </Button>
        </motion.div>
        
        {/* Storylane iframe */}
        <motion.div 
          className="mt-16 max-w-6xl mx-auto"
          id="demo-iframe"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <iframe
            src="https://golooper.storylane.io/share/tiv5oh6qwtqr"
            className="w-full h-[500px] md:h-[600px] rounded-2xl shadow-2xl border-4 border-background"
            allowFullScreen
            title="Demo integrada Orquest + KairosHR"
          />
        </motion.div>
      </div>
    </section>
  );
};
