import { Meta } from "@/components/seo/Meta";
import { BadgeHero } from "@/components/ui/badge-hero";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";

const Team = () => {
  const { data: members, isLoading } = useTeamMembers();

  return (
    <>
      <Meta
        title="Equipo - NRRO Asesores"
        description="Conoce al equipo de profesionales de NRRO - expertos comprometidos con el éxito de nuestros clientes"
        canonicalUrl={`${window.location.origin}/equipo`}
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <BadgeHero>Equipo</BadgeHero>
              </div>
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
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-96 rounded-lg" />
                ))}
              </div>
            ) : members && members.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {members.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    name={member.name}
                    position={member.position || ''}
                    bio={member.bio}
                    specialization={member.specialization}
                    linkedin={member.linkedin}
                    email={member.email}
                    avatarUrl={member.avatar_url}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay miembros del equipo disponibles en este momento.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Team;
