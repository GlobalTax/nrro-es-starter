import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useJobPositions } from "@/hooks/useJobPositions";
import { JobPositionCard } from "./JobPositionCard";
import { JobPositionModal } from "./JobPositionModal";
import { JobPosition } from "@/types/jobPosition";
import { Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OpenPositionsSectionProps {
  onApply: (position: JobPosition) => void;
}

export const OpenPositionsSection = ({ onApply }: OpenPositionsSectionProps) => {
  const { t } = useLanguage();
  const { data: positions, isLoading } = useJobPositions({ status: 'published' });
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  console.log('OpenPositionsSection - isLoading:', isLoading, 'positions:', positions?.length);
  
  // Ref para animación
  const positionsRef = useRef<HTMLDivElement>(null);
  const isPositionsInView = useInView(positionsRef, { once: true, margin: "-100px" });

  const handleViewDetails = (position: JobPosition) => {
    setSelectedPosition(position);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">{t('careers.openPositions.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay posiciones publicadas, mostrar mensaje elegante
  if (!positions || positions.length === 0) {
    return (
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Briefcase className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-normal mb-4">
              {t('careers.openPositions.noPositions.title')}
            </h2>
            <p className="text-body leading-relaxed">
              {t('careers.openPositions.noPositions.description')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Columna 1: Overline */}
            <div className="relative">
              <h3 className="font-mono font-light text-sm md:text-base tracking-tight text-foreground/70 pb-3">
                {t('careers.openPositions.overline')}
              </h3>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
            </div>
            
            {/* Columna 2: Título */}
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight">
                {t('careers.openPositions.title')}
              </h2>
            </div>
            
            {/* Columna 3: Descripción */}
            <div>
              <p className="text-lg font-normal text-foreground leading-relaxed">
                {t('careers.openPositions.description')}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" ref={positionsRef}>
            {positions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isPositionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <JobPositionCard
                  position={position}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <JobPositionModal
        position={selectedPosition}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onApply={onApply}
      />
    </>
  );
};
