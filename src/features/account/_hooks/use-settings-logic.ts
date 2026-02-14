"use client";

import { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import { useI18n } from '@/context/i18n-context';
import { useUser } from '@/hooks/state/use-user';
import type { ExpertiseBadge } from '@/types/domain';

export function useSettingsLogic() {
  const router = useRouter();
  const { t } = useI18n();
  const { state: authState, dispatch: authDispatch, logout } = useAuth();
  const { user } = authState;
  const { profile, updateProfile, uploadAvatar, loading: profileLoading } = useUser();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<ExpertiseBadge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (user) setName(user.name);
    if (profile) {
      setBio(profile.bio || "");
      setSelectedBadges(profile.expertiseBadges || []);
    }
  }, [user, profile]);

  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);
    try {
      if (user?.name !== name) {
        authDispatch({ type: 'UPDATE_USER_PROFILE', payload: { name } });
      }
      await updateProfile({ bio, expertiseBadges: selectedBadges });
      toast({
        title: "Profile Updated",
        description: "Your personal information has been successfully saved.",
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Update Failed", description: e.message });
    } finally {
      setIsSaving(false);
    }
  }, [user, name, bio, selectedBadges, authDispatch, updateProfile]);

  const handleWithdraw = useCallback(() => {
    if (confirm(t('settings.confirmWithdrawal'))) {
      logout();
      router.push("/login");
      toast({
        variant: "destructive",
        title: t('settings.identityDeregistered'),
        description: t('settings.identityDeregisteredDescription'),
      });
    }
  }, [logout, router, t]);

  const handleAvatarUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadAvatar(file);
      toast({ title: "Avatar updated successfully" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: e.message });
    } finally {
      setIsUploading(false);
    }
  }, [uploadAvatar]);

  const handleBadgeToggle = useCallback((badge: ExpertiseBadge) => {
    setSelectedBadges(prev => {
      const isSelected = prev.some(b => b.id === badge.id);
      if (isSelected) {
        return prev.filter(b => b.id !== badge.id);
      } else {
        if (prev.length >= 5) {
            toast({ variant: "destructive", title: "Expertise Limit Reached", description: "You can select up to 5 areas of expertise." });
            return prev;
        }
        return [...prev, badge];
      }
    });
  }, []);

  const handleDeleteOrganization = useCallback(() => {
    console.log("Deleting organization...");
  }, []);

  return {
    isMounted,
    user,
    profile,
    name,
    setName,
    bio,
    setBio,
    selectedBadges,
    handleBadgeToggle,
    isSaving: isSaving || profileLoading,
    isUploading,
    handleSaveProfile,
    handleWithdraw,
    handleDeleteOrganization,
    handleAvatarUpload,
    avatarInputRef,
    t,
  };
}
