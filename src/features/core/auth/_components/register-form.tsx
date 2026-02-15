
'use client';

import { Mail, User, Lock, Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/app/_components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/app/_components/ui/form';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/app/_components/ui/input-group";
import { Label } from '@/app/_components/ui/label';
import { useI18n } from '@/features/core/i18n/i18n-context';

interface RegisterFormProps {
    onSubmit: () => void;
    isLoading: boolean;
}

export default function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const { t } = useI18n();
  const { control } = useFormContext();

  return (
    <form onSubmit={onSubmit} className="space-y-4 flex-1 flex flex-col">
       <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
             <Label htmlFor="r-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t('auth.digitalDesignation')}</Label>
              <InputGroup className="rounded-2xl bg-muted/20 border-none h-12">
                <InputGroupAddon className="pl-4"><User className="w-4 h-4 text-muted-foreground/30" /></InputGroupAddon>
                <FormControl><InputGroupInput id="r-name" placeholder={t('auth.nickname')} className="font-medium" {...field} /></FormControl>
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
             <Label htmlFor="r-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t('auth.contactEndpoint')}</Label>
              <InputGroup className="rounded-2xl bg-muted/20 border-none h-12">
                <InputGroupAddon className="pl-4"><Mail className="w-4 h-4 text-muted-foreground/30" /></InputGroupAddon>
                <FormControl><InputGroupInput id="r-email" type="email" placeholder={t('auth.email')} className="font-medium" {...field} /></FormControl>
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
             <Label htmlFor="r-pass" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t('auth.setSecurityKey')}</Label>
              <InputGroup className="rounded-2xl bg-muted/20 border-none h-12">
                <InputGroupAddon className="pl-4"><Lock className="w-4 h-4 text-muted-foreground/30" /></InputGroupAddon>
                <FormControl><InputGroupInput id="r-pass" type="password" placeholder={t('auth.password')} className="font-medium" {...field} /></FormControl>
            </InputGroup>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex-grow" />
      <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-primary/20" disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : t('auth.registerSovereignty')}
      </Button>
    </form>
  );
}
