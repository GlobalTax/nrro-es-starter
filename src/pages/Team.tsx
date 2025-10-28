import { Card } from "@/components/ui/card";
import { Overline } from "@/components/ui/typography";
import { Meta } from "@/components/seo/Meta";
import { teamMembers } from "@/data/mockData";
import { Linkedin } from "lucide-react";

const Team = () => {
  return (
    <>
      <Meta
        title="Team"
        description="Meet the Ethos Ventures team - experienced investors committed to building exceptional companies"
        canonicalUrl={`${window.location.origin}/team`}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="service-hero-overline mb-6">Equipo</div>
              <h1 className="service-hero-title mb-8">
                Nuestro Equipo
              </h1>
              <p className="service-hero-subtitle max-w-3xl mx-auto">
                Profesionales experimentados comprometidos con el éxito de nuestros clientes, 
                aportando experiencia técnica y visión estratégica en cada proyecto.
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden border-border">
                  <div className="aspect-square bg-neutral-100" />
                  
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                    <p className="section-overline mb-4">{member.role}</p>
                    <p className="service-body mb-6">{member.bio}</p>
                    
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent transition-smooth border-b border-foreground hover:border-accent"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Team;
