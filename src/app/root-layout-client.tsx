
"use client";

import { useEffect, type ReactNode, useState } from "react";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter }from "next/navigation";

import { SidebarProvider, SidebarInset } from "@/app/_components/ui/sidebar";
import { AccountProvider } from "@/context/account-context";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/features/core/i18n/i18n-context";

const LoadingScreen = () => {
  const { t, isLoading } = useI18n();
  const message = isLoading ? "Calibrating dimension..." : t('common.loading');

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center space-y-4 bg-background">
      <div className="text-4xl animate-bounce">🐢</div>
      <div className="flex items-center gap-2 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
        <Loader2 className="w-3 h-3 animate-spin" /> {message}
      </div>
    </div>
  );
};


export function RootLayoutClient({ children, sidebar, header, main }: {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
  main: ReactNode;
}) {
  const { state } = useAuth();
  const { user, authInitialized } = state;
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = ['/login', '/register', '/forgot-password'].some(p => pathname.startsWith(p));
  const isPublicRoute = isAuthRoute || pathname === '/';
  
  useEffect(() => {
    if (!authInitialized) return;

    if (user && isPublicRoute) {
      router.replace('/overview');
    } else if (!user && !isPublicRoute) {
      router.replace('/');
    }
  }, [authInitialized, user, pathname, router, isPublicRoute]);

  if (!authInitialized || (user && isPublicRoute) || (!user && !isPublicRoute)) {
    return <LoadingScreen />;
  }
  
  if (!user && isPublicRoute) {
    return <>{children}</>;
  }

  // Render the protected dashboard layout for authenticated users on non-public routes.
  return (
    <AccountProvider>
      <SidebarProvider>
        {sidebar}
        <SidebarInset>
          {header}
          <main className="flex-1 p-6 overflow-y-auto content-visibility-auto">
            {main}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AccountProvider>
  );
}
