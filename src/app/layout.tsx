
import type {Metadata} from 'next';

import './globals.css';
import { Inter } from 'next/font/google';

import {Toaster} from '@/app/_components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import { AuthProvider } from '@/context/auth-context';
import { FirebaseClientProvider } from '@/context/firebase-context';
import { ThemeProvider } from '@/context/theme-context';
import { I18nProvider } from '@/features/core/i18n/i18n-context';
import { cn } from '@/lib/utils';

import { RootLayoutClient } from './root-layout-client';

export const metadata: Metadata = {
  title: 'OrgVerse | Modern Space Architecture',
  description: 'From Single Identity to Multidimensional Organization',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
  sidebar,
  header,
  main,
  auth,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, 'font-sans', 'antialiased', 'min-h-screen', 'bg-background')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <FirebaseClientProvider>
              <AuthProvider>
                <AppProvider>
                  <RootLayoutClient sidebar={sidebar} header={header} main={main}>
                    {children}
                  </RootLayoutClient>
                  {auth}
                  <Toaster />
                </AppProvider>
              </AuthProvider>
            </FirebaseClientProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
