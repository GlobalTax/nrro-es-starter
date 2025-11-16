import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Methodology from "./pages/Methodology";
import Team from "./pages/Team";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import LeyBeckham from "./pages/LeyBeckham";
import NotFound from "./pages/NotFound";
import OrquestKairosHR from "./pages/OrquestKairosHR";
import Privacy from "./pages/Privacy";
import Legal from "./pages/Legal";
import Cookies from "./pages/Cookies";
import Terms from "./pages/Terms";
import Strategy from "./pages/Strategy";
import Sectors from "./pages/Sectors";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCaseStudies } from "./pages/admin/AdminCaseStudies";
import AdminServices from "./pages/admin/AdminServices";
import { AdminBlog } from "./pages/admin/AdminBlog";
import BlogDetail from "./pages/BlogDetail";
import { AdminTeam } from "./pages/admin/AdminTeam";
import { AdminUsers } from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import { AdminSettings } from "./pages/admin/AdminSettings";
import AdminCandidatos from "./pages/admin/AdminCandidatos";
import AdminJobPositions from "./pages/admin/AdminJobPositions";
import AdminContactLeads from "./pages/admin/AdminContactLeads";
import AdminLandings from "./pages/admin/AdminLandings";
import AdminLeyBeckhamLeads from "./pages/admin/AdminLeyBeckhamLeads";
import AdminDemoRequests from "./pages/admin/AdminDemoRequests";
import { AdminCompanySetupLeads } from "./pages/admin/AdminCompanySetupLeads";
import AdminTechnology from "./pages/admin/AdminTechnology";
import AdminSitemap from "./pages/admin/AdminSitemap";
import { CompanySetupCalculator } from "./pages/CompanySetupCalculator";
import { NIEServiceSpain } from "./pages/NIEServiceSpain";
import { TechStartupSetup } from "./pages/TechStartupSetup";
import { ExpressCompanySetup } from "./pages/ExpressCompanySetup";
import { HerenciasBarcelona } from "./pages/HerenciasBarcelona";
import SitemapXML from "./pages/SitemapXML";

const queryClient = new QueryClient();

const App = () => {
  // Componente interno para manejar redirecciones de idioma
  const LanguageRedirect = () => {
    const location = useLocation();
    const { setLanguage } = useLanguage();

    useEffect(() => {
      // Detectar el idioma de la URL actual y sincronizar
      if (location.pathname.startsWith('/ca/')) {
        setLanguage('ca');
      } else if (location.pathname.startsWith('/en/')) {
        setLanguage('en');
      } else {
        setLanguage('es');
      }
    }, [location.pathname, setLanguage]);

    return null;
  };

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
            <Routes>
            {/* Main routes - Spanish (default, no prefix) */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/servicios" element={<Layout><Services /></Layout>} />
            <Route path="/servicios/:slug" element={<Layout><ServiceDetail /></Layout>} />
            <Route path="/casos-exito" element={<Layout><CaseStudies /></Layout>} />
            <Route path="/casos-exito/:slug" element={<Layout><CaseStudyDetail /></Layout>} />
            <Route path="/nosotros" element={<Layout><About /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
            <Route path="/equipo" element={<Layout><Team /></Layout>} />
            <Route path="/metodologia" element={<Layout><Methodology /></Layout>} />
            <Route path="/estrategia" element={<Layout><Strategy /></Layout>} />
            <Route path="/sectores" element={<Layout><Sectors /></Layout>} />
            <Route path="/contacto" element={<Layout><Contact /></Layout>} />
          <Route path="/privacidad" element={<Layout><Privacy /></Layout>} />
          <Route path="/aviso-legal" element={<Layout><Legal /></Layout>} />
          <Route path="/cookies" element={<Layout><Cookies /></Layout>} />
          <Route path="/condiciones-contratacion" element={<Layout><Terms /></Layout>} />
            <Route path="/carreras" element={<Layout><Careers /></Layout>} />
            
        {/* Catalan routes */}
        <Route path="/ca" element={<Layout><Home /></Layout>} />
        <Route path="/ca/serveis" element={<Layout><Services /></Layout>} />
            <Route path="/ca/serveis/:slug" element={<Layout><ServiceDetail /></Layout>} />
            <Route path="/ca/casos-exit" element={<Layout><CaseStudies /></Layout>} />
            <Route path="/ca/casos-exit/:slug" element={<Layout><CaseStudyDetail /></Layout>} />
            <Route path="/ca/nosaltres" element={<Layout><About /></Layout>} />
            <Route path="/ca/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/ca/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
            <Route path="/ca/equip" element={<Layout><Team /></Layout>} />
            <Route path="/ca/metodologia" element={<Layout><Methodology /></Layout>} />
            <Route path="/ca/estrategia" element={<Layout><Strategy /></Layout>} />
            <Route path="/ca/sectors" element={<Layout><Sectors /></Layout>} />
            <Route path="/ca/contacte" element={<Layout><Contact /></Layout>} />
            <Route path="/ca/privacitat" element={<Layout><Privacy /></Layout>} />
            <Route path="/ca/avis-legal" element={<Layout><Legal /></Layout>} />
            <Route path="/ca/cookies" element={<Layout><Cookies /></Layout>} />
            <Route path="/ca/condicions-contractacio" element={<Layout><Terms /></Layout>} />
            <Route path="/ca/carreres" element={<Layout><Careers /></Layout>} />

        {/* English routes */}
        <Route path="/en" element={<Layout><Home /></Layout>} />
        <Route path="/en/services" element={<Layout><Services /></Layout>} />
            <Route path="/en/services/:slug" element={<Layout><ServiceDetail /></Layout>} />
            <Route path="/en/case-studies" element={<Layout><CaseStudies /></Layout>} />
            <Route path="/en/case-studies/:slug" element={<Layout><CaseStudyDetail /></Layout>} />
            <Route path="/en/about" element={<Layout><About /></Layout>} />
            <Route path="/en/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/en/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
            <Route path="/en/team" element={<Layout><Team /></Layout>} />
            <Route path="/en/methodology" element={<Layout><Methodology /></Layout>} />
            <Route path="/en/strategy" element={<Layout><Strategy /></Layout>} />
            <Route path="/en/sectors" element={<Layout><Sectors /></Layout>} />
            <Route path="/en/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/en/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/en/legal-notice" element={<Layout><Legal /></Layout>} />
            <Route path="/en/cookies" element={<Layout><Cookies /></Layout>} />
            <Route path="/en/terms" element={<Layout><Terms /></Layout>} />
            <Route path="/en/careers" element={<Layout><Careers /></Layout>} />
            
            {/* Special landings */}
            <Route path="/ley-beckham" element={<LandingLayout><LeyBeckham /></LandingLayout>} />
            <Route path="/en/ley-beckham" element={<LandingLayout><LeyBeckham /></LandingLayout>} />
            <Route path="/orquest-kairoshr" element={<OrquestKairosHR />} />
            
            {/* Company Setup Landings */}
            <Route path="/en/company-setup-calculator" element={<CompanySetupCalculator />} />
            <Route path="/en/nie-spain-foreigners" element={<NIEServiceSpain />} />
            <Route path="/en/startup-company-setup-spain" element={<TechStartupSetup />} />
            <Route path="/en/fast-company-registration-spain" element={<ExpressCompanySetup />} />
            <Route path="/abogados-herencias-barcelona" element={<HerenciasBarcelona />} />

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
              <Route path="landings" element={<AdminLandings />} />
              <Route path="case-studies" element={<AdminCaseStudies />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="job-positions" element={<AdminJobPositions />} />
              <Route path="candidatos" element={<AdminCandidatos />} />
              <Route path="contact-leads" element={<AdminContactLeads />} />
              <Route path="ley-beckham-leads" element={<AdminLeyBeckhamLeads />} />
              <Route path="demo-requests" element={<AdminDemoRequests />} />
              <Route path="company-setup-leads" element={<AdminCompanySetupLeads />} />
              <Route path="technology" element={<AdminTechnology />} />
              <Route path="sitemap" element={<AdminSitemap />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Sitemap XML */}
            <Route path="/sitemap.xml" element={<SitemapXML />} />

            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
