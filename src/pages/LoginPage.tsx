import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background p-4">
      <div className="w-full max-w-md bg-brand-white-ish rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-display text-brand-accent text-center mb-6">Welcome to Crafty Spinx</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // No third-party providers as per guidelines
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'var(--color-accent)',
                  brandAccent: 'var(--color-primary)',
                  brandButtonText: 'var(--color-white-ish)',
                  defaultButtonBackground: 'var(--color-secondary)',
                  defaultButtonBackgroundHover: 'var(--color-primary)',
                  inputBackground: 'var(--color-background)',
                  inputBorder: 'var(--color-primary)',
                  inputBorderHover: 'var(--color-accent)',
                  inputBorderFocus: 'var(--color-accent)',
                  inputText: 'var(--color-text)',
                  inputLabelText: 'var(--color-text)',
                  messageText: 'var(--color-text)',
                  messageBackground: 'var(--color-background)',
                  anchorTextColor: 'var(--color-primary)',
                  anchorTextHoverColor: 'var(--color-accent)',
                },
                fontSizes: {
                  baseButtonSize: '18px',
                  baseInputSize: '18px',
                  baseLabelSize: '16px',
                }
              },
            },
          }}
          theme="light"
        />
      </div>
    </div>
  );
};

export default LoginPage;