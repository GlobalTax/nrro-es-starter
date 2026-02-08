import { useTeamMembers } from "@/hooks/useTeamMembers";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TeamMosaicHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const TeamMosaicHero = ({
  title,
  subtitle,
  ctaText,
  ctaLink = "/contacto",
}: TeamMosaicHeroProps) => {
  const { i18n } = useTranslation();
  const { data: members = [] } = useTeamMembers(i18n.language);

  const displayTitle = title || "Nuestro equipo";
  const displaySubtitle = subtitle || `${members.length} profesionales a tu servicio`;
  const displayCta = ctaText || "Contacta con nosotros";

  if (members.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full overflow-hidden"
    >
      {/* Photo grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-0">
        {members.map((member) => (
          <div key={member.id} className="aspect-square overflow-hidden bg-muted">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.name}
                className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-4xl font-normal text-muted-foreground/30">
                  {member.name?.charAt(0) ?? "N"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pointer-events-none">
        <div className="text-center pb-12 md:pb-16 px-4 pointer-events-auto">
          <h1 className="text-3xl md:text-5xl font-light text-white mb-3 tracking-tight">
            {displayTitle}
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-6">
            {displaySubtitle}
          </p>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-smooth">
            <Link to={ctaLink}>{displayCta}</Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
};
