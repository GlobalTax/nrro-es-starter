import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  position: string;
  bio?: string;
  specialization?: string;
  linkedin?: string;
  email?: string;
  avatarUrl?: string;
}

export const TeamMemberCard = ({
  name,
  position,
  bio,
  specialization,
  linkedin,
  email,
  avatarUrl,
}: TeamMemberCardProps) => {
  return (
    <Card className="overflow-hidden border-border hover-lift transition-smooth">
      {/* Photo */}
      <div className="aspect-square bg-muted overflow-hidden">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-6xl font-bold text-muted-foreground/20">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <h3 className="text-xl font-medium text-foreground mb-1">
          {name}
        </h3>
        <p className="section-overline mb-1">{position}</p>
        {specialization && (
          <p className="text-xs text-muted-foreground mb-4">
            {specialization}
          </p>
        )}
        {bio && (
          <p className="service-body mb-6 text-sm">
            {bio}
          </p>
        )}

        {/* Social Links */}
        {(linkedin || email) && (
          <div className="flex items-center gap-4">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-smooth"
                aria-label={`Perfil de LinkedIn de ${name}`}
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-smooth"
                aria-label={`Enviar email a ${name}`}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
