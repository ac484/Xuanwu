
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useI18n } from '@/context/i18n-context';
import { toast } from '@/hooks/ui/use-toast';
import { authAdapter } from '@/features/core/firebase/auth/auth.adapter';
import { loginSchema, registerSchema, resetPasswordSchema, type LoginFormValues, type RegisterFormValues, type ResetPasswordFormValues } from '../_schemas/auth.schema';

export function useAuthLogic(defaultTab: 'login' | 'register', mode: 'page' | 'modal') {
  const router = useRouter();
  const { t } = useI18n();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form hooks
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  // Handlers
  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await authAdapter.signInWithEmailAndPassword(data.email, data.password);
      toast({ title: t('auth.identityResonanceSuccessful') });
      if (mode === 'modal') router.back();
      router.push('/overview');
    } catch (e: any) {
      toast({ variant: 'destructive', title: t('auth.authenticationFailed'), description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const { user } = await authAdapter.createUserWithEmailAndPassword(data.email, data.password);
      await authAdapter.updateProfile(user, { displayName: data.name });
      toast({ title: t('auth.identityResonanceSuccessful') });
      if (mode === 'modal') router.back();
      router.push('/overview');
    } catch (e: any) {
      toast({ variant: 'destructive', title: t('auth.authenticationFailed'), description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onResetPasswordSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await authAdapter.sendPasswordResetEmail(data.email);
      setIsResetOpen(false);
      toast({ title: t('auth.resetProtocolSent') });
    } catch (e: any) {
      toast({ variant: 'destructive', title: t('auth.resetFailed'), description: e.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAnonymous = async () => {
    setIsSubmitting(true);
    try {
      await authAdapter.signInAnonymously();
      if (mode === 'modal') router.back();
      router.push('/overview');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openResetDialog = () => {
      const currentEmail = loginForm.getValues('email');
      if (currentEmail) {
          resetPasswordForm.setValue('email', currentEmail);
      }
      setIsResetOpen(true);
  };

  return {
    t,
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
  };
}
