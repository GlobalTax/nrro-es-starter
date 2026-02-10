import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useTranslation } from 'react-i18next';
import { ScrollToTop } from "@/components/ScrollToTop";
import { lazy, Suspense, useEffect, ReactNode, ComponentType } from "react";

// Public pages (static imports for core pages, lazy for less-visited)
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Methodology = lazy(() => import("./pages/Methodology"));
const Team = lazy(() => import("./pages/Team"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const LeyBeckham = lazy(() => import("./pages/LeyBeckham"));
const OrquestKairosHR = lazy(() => import("./pages/OrquestKairosHR"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Legal = lazy(() => import("./pages/Legal"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Terms = lazy(() => import("./pages/Terms"));
const Strategy = lazy(() => import("./pages/Strategy"));
const Sectors = lazy(() => import("./pages/Sectors"));
const Resources = lazy(() => import("./pages/Resources"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail"));
const WhistleblowerChannel = lazy(() => import("./pages/WhistleblowerChannel"));
const SetupCompanySpain = lazy(() => import("./pages/SetupCompanySpain").then(m => ({ default: m.SetupCompanySpain })));
const CompanySetupCalculator = lazy(() => import("./pages/CompanySetupCalculator").then(m => ({ default: m.CompanySetupCalculator })));
const NIEServiceSpain = lazy(() => import("./pages/NIEServiceSpain").then(m => ({ default: m.NIEServiceSpain })));
const TechStartupSetup = lazy(() => import("./pages/TechStartupSetup").then(m => ({ default: m.TechStartupSetup })));
const ExpressCompanySetup = lazy(() => import("./pages/ExpressCompanySetup").then(m => ({ default: m.ExpressCompanySetup })));
const DynamicLandingPage = lazy(() => import("./pages/DynamicLandingPage").then(m => ({ default: m.DynamicLandingPage })));
const SitemapXML = lazy(() => import("./pages/SitemapXML"));
const PresentationPreview = lazy(() => import("./pages/PresentationPreview"));

// Admin pages (lazy loaded — only needed by admins)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminCaseStudies = lazy(() => import("./pages/admin/AdminCaseStudies").then(m => ({ default: m.AdminCaseStudies })));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog").then(m => ({ default: m.AdminBlog })));
const AdminTeam = lazy(() => import("./pages/admin/AdminTeam").then(m => ({ default: m.AdminTeam })));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings").then(m => ({ default: m.AdminSettings })));
const AdminCandidatos = lazy(() => import("./pages/admin/AdminCandidatos"));
const AdminJobPositions = lazy(() => import("./pages/admin/AdminJobPositions"));
const AdminContactLeads = lazy(() => import("./pages/admin/AdminContactLeads"));
const AdminLandings = lazy(() => import("./pages/admin/AdminLandings"));
const LandingDetailPage = lazy(() => import("./pages/admin/LandingDetailPage"));
const LandingDashboard = lazy(() => import("./pages/admin/LandingDashboard"));
const AdminLeyBeckhamLeads = lazy(() => import("./pages/admin/AdminLeyBeckhamLeads"));
const AdminDemoRequests = lazy(() => import("./pages/admin/AdminDemoRequests"));
const AdminCompanySetupLeads = lazy(() => import("./pages/admin/AdminCompanySetupLeads").then(m => ({ default: m.AdminCompanySetupLeads })));
const AdminTechnology = lazy(() => import("./pages/admin/AdminTechnology"));
const AdminSitemap = lazy(() => import("./pages/admin/AdminSitemap"));
const AdminResources = lazy(() => import("./pages/admin/AdminResources"));
const AdminProposals = lazy(() => import("./pages/admin/AdminProposals"));
const AdminProposalTemplates = lazy(() => import("./pages/admin/AdminProposalTemplates"));
const AdminCorporatePresentations = lazy(() => import("./pages/admin/AdminCorporatePresentations"));
const AdminToolsHub = lazy(() => import("./pages/admin/AdminToolsHub"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews").then(m => ({ default: m.AdminNews })));
const AdminWhistleblower = lazy(() => import("./pages/admin/AdminWhistleblower"));
const AdminTopBarSettings = lazy(() => import("./pages/admin/AdminTopBarSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// Helper to generate multilingual routes
type RouteConfig = {
  es: string;
  ca: string;
  en: string;
  component: ComponentType;
  layout?: 'default' | 'landing' | 'none';
};

const multilingualRoutes: RouteConfig[] = [
  { es: "/servicios", ca: "/ca/serveis", en: "/en/services", component: Services },
  { es: "/servicios/:slug", ca: "/ca/serveis/:slug", en: "/en/services/:slug", component: ServiceDetail },
  { es: "/casos-exito", ca: "/ca/casos-exit", en: "/en/case-studies", component: CaseStudies },
  { es: "/casos-exito/:slug", ca: "/ca/casos-exit/:slug", en: "/en/case-studies/:slug", component: CaseStudyDetail },
  { es: "/nosotros", ca: "/ca/nosaltres", en: "/en/about", component: About },
  { es: "/blog", ca: "/ca/blog", en: "/en/blog", component: Blog },
  { es: "/blog/:slug", ca: "/ca/blog/:slug", en: "/en/blog/:slug", component: BlogDetail },
  { es: "/equipo", ca: "/ca/equip", en: "/en/team", component: Team },
  { es: "/metodologia", ca: "/ca/metodologia", en: "/en/methodology", component: Methodology },
  { es: "/estrategia", ca: "/ca/estrategia", en: "/en/strategy", component: Strategy },
  { es: "/sectores", ca: "/ca/sectors", en: "/en/sectors", component: Sectors },
  { es: "/contacto", ca: "/ca/contacte", en: "/en/contact", component: Contact },
  { es: "/privacidad", ca: "/ca/privacitat", en: "/en/privacy", component: Privacy },
  { es: "/aviso-legal", ca: "/ca/avis-legal", en: "/en/legal-notice", component: Legal },
  { es: "/cookies", ca: "/ca/cookies", en: "/en/cookies", component: Cookies },
  { es: "/condiciones-contratacion", ca: "/ca/condicions-contractacio", en: "/en/terms", component: Terms },
  { es: "/carreras", ca: "/ca/carreres", en: "/en/careers", component: Careers },
  { es: "/recursos", ca: "/ca/recursos", en: "/en/resources", component: Resources },
  { es: "/recursos/:slug", ca: "/ca/recursos/:slug", en: "/en/resources/:slug", component: ResourceDetail },
  { es: "/ley-beckham", ca: "/ca/llei-beckham", en: "/en/beckham-law", component: LeyBeckham, layout: 'landing' },
  { es: "/orquest-kairoshr", ca: "/ca/orquest-kairoshr", en: "/en/orquest-kairoshr", component: OrquestKairosHR, layout: 'landing' },
];

const wrapWithLayout = (Component: ComponentType, layout: RouteConfig['layout'] = 'default'): ReactNode => {
  const el = <Component />;
  switch (layout) {
    case 'landing':
      return <LandingLayout>{el}</LandingLayout>;
    case 'none':
      return el;
    default:
      return <Layout>{el}</Layout>;
  }
};

const renderMultilingualRoutes = () =>
  multilingualRoutes.flatMap((route) =>
    (['es', 'ca', 'en'] as const).map((lang) => (
      <Route
        key={`${lang}-${route[lang]}`}
        path={route[lang]}
        element={wrapWithLayout(route.component, route.layout)}
      />
    ))
  );

const LanguageRedirect = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    let targetLang = 'es';
    if (location.pathname.startsWith('/ca/') || location.pathname === '/ca') {
      targetLang = 'ca';
    } else if (location.pathname.startsWith('/en/') || location.pathname === '/en') {
      targetLang = 'en';
    }
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <LanguageRedirect />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Home routes */}
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  <Route path="/ca" element={<Layout><Home /></Layout>} />
                  <Route path="/en" element={<Layout><Home /></Layout>} />

                  {/* Multilingual routes (ES, CA, EN) */}
                  {renderMultilingualRoutes()}

                  {/* Company Setup Landings */}
                  <Route path="/set-up-company-spain" element={<SetupCompanySpain />} />
                  <Route path="/en/company-setup-calculator" element={<CompanySetupCalculator />} />
                  <Route path="/en/nie-spain-foreigners" element={<NIEServiceSpain />} />
                  <Route path="/en/startup-company-setup-spain" element={<TechStartupSetup />} />
                  <Route path="/en/fast-company-registration-spain" element={<ExpressCompanySetup />} />
                  <Route path="/en/set-up-company-spain" element={<SetupCompanySpain />} />
                  <Route path="/crear-empresa-espana" element={<SetupCompanySpain />} />
                  <Route path="/ca/crear-empresa-espanya" element={<SetupCompanySpain />} />

                  {/* Whistleblower Channel */}
                  <Route path="/canal-denuncias" element={<WhistleblowerChannel />} />

                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="landing-dashboard" element={<LandingDashboard />} />
                    <Route path="landings" element={<AdminLandings />} />
                    <Route path="landings/:id" element={<LandingDetailPage />} />
                    <Route path="case-studies" element={<AdminCaseStudies />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="news" element={<AdminNews />} />
                    <Route path="team" element={<AdminTeam />} />
                    <Route path="job-positions" element={<AdminJobPositions />} />
                    <Route path="candidatos" element={<AdminCandidatos />} />
                    <Route path="contact-leads" element={<AdminContactLeads />} />
                    <Route path="ley-beckham-leads" element={<AdminLeyBeckhamLeads />} />
                    <Route path="demo-requests" element={<AdminDemoRequests />} />
                    <Route path="company-setup-leads" element={<AdminCompanySetupLeads />} />
                    <Route path="technology" element={<AdminTechnology />} />
                    <Route path="sitemap" element={<AdminSitemap />} />
                    <Route path="resources" element={<AdminResources />} />
                    <Route path="proposals" element={<AdminProposals />} />
                    <Route path="proposal-templates" element={<AdminProposalTemplates />} />
                    <Route path="presentations" element={<AdminCorporatePresentations />} />
                    <Route path="hub" element={<AdminToolsHub />} />
                    <Route path="whistleblower" element={<AdminWhistleblower />} />
                    <Route path="topbar" element={<AdminTopBarSettings />} />
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute requiredRole="super_admin">
                          <AdminUsers />
                        </ProtectedRoute>
                      }
                    />
                  </Route>

                  {/* Standalone routes */}
                  <Route path="/presentation-preview/:id" element={<PresentationPreview />} />
                  <Route path="/sitemap.xml" element={<SitemapXML />} />

                  {/* Dynamic Landing Pages - Must be before 404 */}
                  <Route path="/:slug" element={<DynamicLandingPage />} />

                  {/* 404 - Must be last */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
