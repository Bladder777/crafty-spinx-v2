import * as React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/supabaseClient';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-background p-4">
      <div className="w-full max-w-md bg-brand-white-ish rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-display text-brand-accent text-center mb-6">Welcome to Crafty Spinx!</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // You can add 'google', 'github', etc. here if you configure them in Supabase
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
                  defaultButtonBorder: 'var(--color-secondary)',
                  defaultButtonText: 'var(--color-white-ish)',
                  inputBackground: 'var(--color-background)',
                  inputBorder: 'var(--color-secondary)',
                  inputBorderHover: 'var(--color-primary)',
                  inputBorderFocus: 'var(--color-accent)',
                  inputText: 'var(--color-text)',
                  inputLabelText: 'var(--color-text)',
                  anchorTextColor: 'var(--color-accent)',
                  anchorTextHoverColor: 'var(--color-primary)',
                },
              },
            },
          }}
          theme="light"
          magicLink={true}
        />
      </div>
    </div>
  );
};

export default Login;