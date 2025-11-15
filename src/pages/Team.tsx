import { Meta } from "@/components/seo/Meta";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PersonSchema } from "@/components/seo/PersonSchema";
import { mainBreadcrumbs } from "@/lib/seoUtils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { BadgeHero } from "@/components/ui/badge-hero";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

import { useTeamSearch, useTeamFilterOptions, useTeamPositionOptions } from "@/hooks/useTeamSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeFilter } from "@/components/ui/badge-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";

const Team = () => {
  const { t, language } = useLanguage();
  const [activeSpecialization, setActiveSpecialization] = useState<string | null>(null);
  const [activePosition, setActivePosition] = useState<string | null>(null);
  const { data: members, isLoading } = useTeamSearch({ 
    specialization: activeSpecialization || undefined,
    position: activePosition || undefined
  }, language);
  const { data: specializations = [] } = useTeamFilterOptions(language);
  const { data: positions = [] } = useTeamPositionOptions(language);

  return (
    <>
      <Meta
        title={t('team.meta.title')}
        description={t('team.meta.description')}
        canonicalUrl={`${window.location.origin}/equipo`}
      />
      <BreadcrumbSchema items={mainBreadcrumbs.team} />
      
      {/* PersonSchema for each team member */}
      {members?.map((member) => (
        <PersonSchema
          key={member.id}
          name={member.name}
          jobTitle={member.position}
          description={member.bio}
          email={member.email}
          imageUrl={member.avatar_url}
          url={member.linkedin}
        />
      ))}

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-black py-32 md:py-48 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BadgeHero>{t('team.hero.badge')}</BadgeHero>
            </div>
            <h1 className="service-hero-title mb-8">
              {t('team.hero.title')}
            </h1>
            <p className="service-hero-subtitle max-w-3xl mx-auto">
              {t('team.hero.subtitle')}
            </p>
          </div>
          </div>
        </section>

        {/* Breadcrumb Navigation */}
        <div className="bg-muted/30 border-b border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Inicio</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Equipo</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Filters */}
        {(positions.length > 0 || specializations.length > 0) && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 mb-12">
            <div className="bg-background rounded-lg shadow-strong p-6">
              {/* Desplegable de categorías */}
              {positions.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {t('team.filters.category')}
                  </label>
                  <Select
                    value={activePosition || "all"}
                    onValueChange={(value) => setActivePosition(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue placeholder={t('team.filters.allCategories')} />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="all">{t('team.filters.allCategories')}</SelectItem>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Badges de especialización */}
              {specializations.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    <span className="text-sm font-normal text-muted-foreground">{t('team.filters.specialization')}</span>
                    <BadgeFilter
                      label={t('team.filters.all')}
                      active={activeSpecialization === null}
                      onClick={() => setActiveSpecialization(null)}
                    />
                    {specializations.map((spec) => (
                      <BadgeFilter
                        key={spec}
                        label={spec}
                        active={activeSpecialization === spec}
                        onClick={() => setActiveSpecialization(activeSpecialization === spec ? null : spec)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Grid */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : members && members.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
              <EmptyState
                icon={Users}
                title={t('team.empty.title')}
                description={
                  activeSpecialization
                    ? t('team.empty.descriptionWithFilter', { specialization: activeSpecialization })
                    : t('team.empty.descriptionGeneral')
                }
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Team;
