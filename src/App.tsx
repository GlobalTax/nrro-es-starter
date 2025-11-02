import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/servicios" element={<Layout><Services /></Layout>} />
            <Route path="/servicios/contable-laboral" element={<Navigate to="/servicios/asesoramiento-contable-laboral" replace />} />
            <Route path="/servicios/:slug" element={<Layout><ServiceDetail /></Layout>} />
            <Route path="/casos-de-exito" element={<Layout><CaseStudies /></Layout>} />
            <Route path="/casos-de-exito/:slug" element={<Layout><CaseStudyDetail /></Layout>} />
            <Route path="/nosotros" element={<Layout><About /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogDetail /></Layout>} />
            <Route path="/equipo" element={<Layout><Team /></Layout>} />
            <Route path="/metodologia" element={<Layout><Methodology /></Layout>} />
            <Route path="/contacto" element={<Layout><Contact /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/legal" element={<Layout><Legal /></Layout>} />
            <Route path="/cookies" element={<Layout><Cookies /></Layout>} />
            <Route path="/talento" element={<Layout><Careers /></Layout>} />
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
