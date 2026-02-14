
'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogTitle } from '@/app/_components/ui/dialog';

import { AuthBackground } from '../_components/auth-background';
import { AuthTabsRoot } from '../_components/auth-tabs-root';
import { ResetPasswordDialog } from '../_components/reset-password-dialog';
import { useAuthLogic } from '../_hooks/use-auth-logic';

export interface LoginPageProps {
  mode?: 'page' | 'modal';
  defaultTab?: 'login' | 'register';
  initialAction?: 'forgot-password';
}

export function LoginPage({ mode = 'page', defaultTab = 'login', initialAction }: LoginPageProps) {
  const router = useRouter();
  
  const {
    isResetOpen,
    setIsResetOpen,
    isSubmitting,
    loginForm,
    registerForm,
    resetPasswordForm,
    onLoginSubmit,
    onRegisterSubmit,
    onResetPasswordSubmit,
    handleAnonymous,
    openResetDialog,
  } = useAuthLogic(defaultTab, mode);

  useEffect(() => {
    if (initialAction === 'forgot-password') {
      setIsResetOpen(true);
    }
  }, [initialAction, setIsResetOpen]);

  const authUi = (
    <>
      <AuthTabsRoot
        isLoading={isSubmitting}
        loginForm={loginForm}
        registerForm={registerForm}
        handleLogin={loginForm.handleSubmit(onLoginSubmit)}
        handleRegister={registerForm.handleSubmit(onRegisterSubmit)}
        handleAnonymous={handleAnonymous}
        openResetDialog={openResetDialog}
        defaultTab={defaultTab}
      />
      <ResetPasswordDialog
        isOpen={isResetOpen}
        onOpenChange={setIsResetOpen}
        form={resetPasswordForm}
        onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}
      />
    </>
  );
  
  if (mode === 'modal') {
    return (
      <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent className="p-0 border-none bg-transparent w-full max-w-md shadow-none">
          <DialogTitle className="sr-only">Authentication</DialogTitle>
          {authUi}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background px-4 overflow-hidden">
      <AuthBackground />
      {authUi}
    </div>
  );
}
