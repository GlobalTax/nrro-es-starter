import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ScrollToTop } from "@/components/ScrollToTop";
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
import AdminDemoRequests from "./pages/admin/AdminDemoRequests";
import AdminTechnology from "./pages/admin/AdminTechnology";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Redirect root to Spanish */}
              <Route path="/" element={<Navigate to="/es" replace />} />
              
              {/* Spanish routes */}
              <Route path="/es" element={<Layout><Home /></Layout>} />
              <Route path="/es/servicios" element={<Layout><Services /></Layout>} />
              <Route path="/es/servicios/:slug" element={<Layout><ServiceDetail /></Layout>} />
              <Route path="/es/casos-exito" element={<Layout><CaseStudies /></Layout>} />
              <Route path="/es/casos-exito/:slug" element={<Layout><CaseStudyDetail /></Layout>} />
              <Route path="/es/nosotros" element={<Layout><About /></Layout>} />
              <Route path="/es/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/es/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
              <Route path="/es/equipo" element={<Layout><Team /></Layout>} />
              <Route path="/es/metodologia" element={<Layout><Methodology /></Layout>} />
              <Route path="/es/contacto" element={<Layout><Contact /></Layout>} />
              <Route path="/es/privacidad" element={<Layout><Privacy /></Layout>} />
              <Route path="/es/aviso-legal" element={<Layout><Legal /></Layout>} />
              <Route path="/es/cookies" element={<Layout><Cookies /></Layout>} />
              <Route path="/es/trabaja-con-nosotros" element={<Layout><Careers /></Layout>} />
              <Route path="/es/ley-beckham" element={<LandingLayout><LeyBeckham /></LandingLayout>} />
              
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
              <Route path="/ca/contacte" element={<Layout><Contact /></Layout>} />
              <Route path="/ca/privacitat" element={<Layout><Privacy /></Layout>} />
              <Route path="/ca/avis-legal" element={<Layout><Legal /></Layout>} />
              <Route path="/ca/cookies" element={<Layout><Cookies /></Layout>} />
              <Route path="/ca/treballa-amb-nosaltres" element={<Layout><Careers /></Layout>} />
              
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
              <Route path="/en/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/en/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/en/legal-notice" element={<Layout><Legal /></Layout>} />
              <Route path="/en/cookies" element={<Layout><Cookies /></Layout>} />
              <Route path="/en/careers" element={<Layout><Careers /></Layout>} />
              
              {/* Legacy routes - redirect to Spanish */}
              <Route path="/servicios" element={<Navigate to="/es/servicios" replace />} />
              <Route path="/servicios/:slug" element={<Navigate to="/es/servicios/:slug" replace />} />
              <Route path="/casos-de-exito" element={<Navigate to="/es/casos-exito" replace />} />
              <Route path="/nosotros" element={<Navigate to="/es/nosotros" replace />} />
              <Route path="/blog" element={<Navigate to="/es/blog" replace />} />
              <Route path="/equipo" element={<Navigate to="/es/equipo" replace />} />
              <Route path="/contacto" element={<Navigate to="/es/contacto" replace />} />
              <Route path="/talento" element={<Navigate to="/es/trabaja-con-nosotros" replace />} />
              
              {/* Special landings (no language prefix) */}
              <Route path="/ley-beckham" element={<LandingLayout><LeyBeckham /></LandingLayout>} />
              <Route path="/orquest-kairoshr" element={<OrquestKairosHR />} />

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
              <Route path="case-studies" element={<AdminCaseStudies />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="job-positions" element={<AdminJobPositions />} />
              <Route path="candidatos" element={<AdminCandidatos />} />
              <Route path="contact-leads" element={<AdminContactLeads />} />
              <Route path="demo-requests" element={<AdminDemoRequests />} />
              <Route path="technology" element={<AdminTechnology />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
            </Route>

              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
