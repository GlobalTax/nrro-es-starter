// Force cache clear - v2
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://*.supabase.co https://cdn.gpteng.co https://*.lovableproject.com https://www.googletagmanager.com https://analytics.tiktok.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' data: blob: https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.gpteng.co https://*.lovableproject.com https://www.googletagmanager.com https://analytics.tiktok.com; frame-src 'self' https://*.lovableproject.com; frame-ancestors 'self' https://lovable.dev https://*.lovable.dev; worker-src 'self' blob:;",
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block'
    },
    proxy: {
      '/sitemap.xml': {
        target: 'https://zntotcpagkunvkwpubqu.supabase.co/storage/v1/object/public/public-files/sitemap.xml',
        changeOrigin: true,
        rewrite: () => ''
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
