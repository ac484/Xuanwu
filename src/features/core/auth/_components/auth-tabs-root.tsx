
'use client';

import { Ghost, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';
import { FormProvider } from 'react-hook-form';

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/_components/ui/card";
import { Skeleton } from '@/app/_components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { useI18n } from "@/features/core/i18n/i18n-context";
import { LanguageSwitcher } from "@/features/layout";


import type { LoginFormValues, RegisterFormValues } from '../_schemas/auth.schema';
import type { UseFormReturn } from 'react-hook-form';

const LoadingSkeleton = () => (
  <div className="space-y-4 flex-1 flex flex-col pt-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full" />
    </div>
    <div className="flex-grow" />
    <Skeleton className="h-14 w-full" />
  </div>
);

const LoginForm = dynamic(() => import('./login-form'), {
  loading: () => <LoadingSkeleton />,
});
const RegisterForm = dynamic(() => import('./register-form'), {
  loading: () => <LoadingSkeleton />,
});

interface AuthTabsRootProps {
  isLoading: boolean;
  loginForm: UseFormReturn<LoginFormValues>;
  registerForm: UseFormReturn<RegisterFormValues>;
  handleLogin: () => void;
  handleRegister: () => void;
  handleAnonymous: () => void;
  openResetDialog: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthTabsRoot({
  isLoading,
  loginForm,
  registerForm,
  handleLogin,
  handleRegister,
  handleAnonymous,
  openResetDialog,
  defaultTab = 'login',
}: AuthTabsRootProps) {
  const { t } = useI18n();

  return (
    <>
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl z-10 rounded-[3rem] overflow-hidden">
        <CardHeader className="pt-12 pb-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center relative group">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500 block cursor-default select-none">🐢</span>
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-10" />
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/30 mb-8 rounded-2xl h-12 p-1">
              <TabsTrigger value="login" className="text-[11px] uppercase font-black rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register" className="text-[11px] uppercase font-black rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">{t('auth.register')}</TabsTrigger>
            </TabsList>

            <div className="min-h-[360px] flex flex-col">
              <TabsContent value="login" className="flex-1 flex flex-col m-0 animate-in fade-in slide-in-from-left-2 duration-300">
                <FormProvider {...loginForm}>
                  <LoginForm onSubmit={handleLogin} onForgotPassword={openResetDialog} isLoading={isLoading} />
                </FormProvider>
              </TabsContent>

              <TabsContent value="register" className="flex-1 flex flex-col m-0 animate-in fade-in slide-in-from-right-2 duration-300">
                <FormProvider {...registerForm}>
                  <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
                </FormProvider>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-8 pb-10 px-8 border-t border-border/10 bg-muted/5">
          <Button variant="ghost" className="w-full gap-3 text-muted-foreground hover:text-primary transition-all text-xs font-black uppercase py-7 rounded-2xl border border-dashed border-border/40 hover:border-primary/20" onClick={handleAnonymous} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Ghost className="w-4 h-4" />}
            {t('auth.guestAccess')}
          </Button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/30 font-bold uppercase tracking-[0.2em] select-none">
            <span>{t('auth.byLoggingIn')}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground/50"><span className="text-xs">🐢</span> {t('auth.dimensionSecurityProtocol')}</span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
