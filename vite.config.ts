import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Directly injecting Supabase URL and Anon Key
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://wzfwgsrtnoyzcqznbovi.supabase.co"),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Zndnc3J0bm95emNxem5ib3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTU5MzUsImV4cCI6MjA3OTQ5MTkzNX0.KyuCNt4RJfHGfXoQ4Mc83a_5JQxtRbaJ10sW6NZ6c8E"),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});