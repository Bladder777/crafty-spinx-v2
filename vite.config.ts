import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load all environment variables from .env files in the current working directory.
    // The third argument '' means no prefix is required for variables to be loaded into `env`.
    const env = loadEnv(mode, process.cwd(), '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are automatically exposed by Vite
        // because they are prefixed with VITE_. No need to define them here explicitly.

        // GEMINI_API_KEY is NOT prefixed with VITE_, so it needs to be explicitly defined
        // to be accessible via import.meta.env.GEMINI_API_KEY in client-side code.
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});