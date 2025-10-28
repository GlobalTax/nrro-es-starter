import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DemoSectionProps {
  onRequestDemo: () => void;
}

export const DemoSection = ({ onRequestDemo }: DemoSectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center px-4">
        <motion.h2 
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Solicita una demo combinada
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Descubre cómo Orquest y KairosHR se integran para optimizar 
          la gestión del personal en tu restaurante.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button 
            onClick={onRequestDemo}
            size="lg"
            variant="secondary"
            className="text-lg px-10 py-6 h-auto shadow-xl hover:shadow-2xl transition-shadow"
          >
            Solicitar demo →
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
