
'use client';

import { Mail } from 'lucide-react';
import { FormProvider, useFormContext } from 'react-hook-form';

import { Button } from '@/app/_components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/app/_components/ui/dialog';
import { FormControl, FormField, FormItem, FormMessage } from '@/app/_components/ui/form';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/_components/ui/input-group";
import { Label } from '@/app/_components/ui/label';
import { useI18n } from '@/features/core/i18n/i18n-context';

import type { ResetPasswordFormValues } from '../_schemas/auth.schema';
import type { UseFormReturn } from 'react-hook-form';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  form: UseFormReturn<ResetPasswordFormValues>; 
}

export function ResetPasswordDialog({ isOpen, onOpenChange, onSubmit, form }: ResetPasswordDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-sm">
        <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-3">🐢 {t('auth.resetPassword')}</DialogTitle>
            <DialogDescription>Enter your email to receive a password reset link.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
            <form onSubmit={onSubmit}>
                <div className="py-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="reset-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t('auth.email')}</Label>
                            <InputGroup className="rounded-2xl bg-muted/20 border-none h-12">
                                <InputGroupAddon className="pl-4"><Mail className="w-4 h-4 text-muted-foreground/30" /></InputGroupAddon>
                                <FormControl><InputGroupInput id="reset-email" type="email" placeholder={t('auth.email')} className="font-medium" {...field} /></FormControl>
                            </InputGroup>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <DialogFooter className="sm:justify-center gap-3">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black text-xs uppercase px-6">{t('common.cancel')}</Button>
                    <Button type="submit" className="rounded-xl font-black text-xs uppercase px-8 shadow-lg shadow-primary/20">{t('auth.sendEmail')}</Button>
                </DialogFooter>
            </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
