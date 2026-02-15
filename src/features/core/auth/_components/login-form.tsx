
'use client';

import { Mail, Lock, Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/app/_components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/app/_components/ui/form';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/_components/ui/input-group";
import { Label } from '@/app/_components/ui/label';
import { useI18n } from '@/features/core/i18n/i18n-context';

interface LoginFormProps {
  onSubmit: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
}

export default function LoginForm({ onSubmit, onForgotPassword, isLoading }: LoginFormProps) {
  const { t } = useI18n();
  const { control } = useFormContext();

  return (
    <form onSubmit={onSubmit} className="space-y-4 flex-1 flex flex-col">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="l-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t('auth.contactEndpoint')}</Label>
            </div>
            <InputGroup className="rounded-2xl bg-muted/20 border-none h-12">
              <InputGroupAddon className="pl-4"><Mail className="w-4 h-4 text-muted-foreground/30" /></InputGroupAddon>
              <FormControl><InputGroupInput id="l-email" type="email" placeholder={t('auth.email')} className="font-medium" {...field} /></FormControl>
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="l-pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t('auth.securityKey')}</Label>
              <button type="button" onClick={onForgotPassword} className="text-[10px] font-black text-primary/60 hover:text-primary transition-colors uppercase">{t('auth.forgotPassword')}</button>
            </div>
            <InputGroup className="rounded-2xl bg-muted/20 border-none h-12">
              <InputGroupAddon className="pl-4"><Lock className="w-4 h-4 text-muted-foreground/30" /></InputGroupAddon>
              <FormControl><InputGroupInput id="l-pass" type="password" placeholder={t('auth.password')} className="font-medium" {...field} /></FormControl>
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex-grow" />
      <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-primary/20" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : t('auth.enterDimension')}
      </Button>
    </form>
  );
}
