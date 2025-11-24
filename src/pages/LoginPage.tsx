import * as React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../services/supabaseClient'; // Corrected import path

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-background p-4">
      <div className="w-full max-w-md bg-brand-white-ish rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-3xl font-display text-brand-accent mb-6 text-center">Welcome to Crafty Spinx</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // We're not using third-party providers for simplicity
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'var(--color-accent)',
                  brandAccent: 'var(--color-secondary)',
                  brandButtonText: 'var(--color-white-ish)',
                  defaultButtonBackground: 'var(--color-primary)',
                  defaultButtonBackgroundHover: 'var(--color-secondary)',
                  defaultButtonBorder: 'var(--color-primary)',
                  inputBackground: 'var(--color-background)',
                  inputBorder: 'var(--color-primary)',
                  inputBorderHover: 'var(--color-accent)',
                  inputBorderFocus: 'var(--color-accent)',
                  inputText: 'var(--color-text)',
                  inputPlaceholder: 'var(--color-text)',
                },
              },
            },
          }}
          theme="light"
          redirectTo={window.location.origin} // Redirects to the current page after auth
        />
      </div>
    </div>
  );
};

export default LoginPage;