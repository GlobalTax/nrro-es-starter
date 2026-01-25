import { ReactNode, useMemo } from "react";
import { TopBar, TopBarProvider, createSupabaseAdapter } from "@/modules/topbar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { supabase } from "@/integrations/supabase/client";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { sourceSite } = useSiteConfig();
  
  const topBarAdapter = useMemo(
    () => createSupabaseAdapter(supabase, { sourceSiteFilter: sourceSite }),
    [sourceSite]
  );

  return (
    <>
      <OrganizationSchema />
      <div className="flex min-h-screen flex-col">
        <TopBarProvider adapter={topBarAdapter}>
          <TopBar />
        </TopBarProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};
