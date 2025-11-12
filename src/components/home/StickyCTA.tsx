import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 md:hidden"
        >
          <Button 
            size="lg" 
            className="rounded-full shadow-strong w-14 h-14 p-0 hover:scale-110 transition-transform"
            asChild
          >
            <Link to="/contacto" aria-label="Contactar">
              <MessageCircle className="w-6 h-6" />
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
