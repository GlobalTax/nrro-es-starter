/// <reference types="vitest" />
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
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://*.supabase.co https://cdn.gpteng.co https://*.lovableproject.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.tiktok.com https://connect.facebook.net https://assets.apollo.io https://consent.cookiebot.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' data: blob: https://*.supabase.co wss://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.gpteng.co https://*.lovableproject.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google.com https://*.google-analytics.com https://analytics.tiktok.com https://*.apollo.io https://consent.cookiebot.com; frame-src 'self' https://*.lovableproject.com https://consentcdn.cookiebot.com https://www.googletagmanager.com; worker-src 'self' blob:;",
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip', '@radix-ui/react-dropdown-menu'],
          'vendor-charts': ['recharts'],
          'vendor-xlsx': ['xlsx'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
}));
