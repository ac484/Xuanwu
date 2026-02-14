"use client";

import { useI18n } from "@/features/core/i18n/i18n-context";

import { DangerZoneCard } from "../_components/settings/danger-zone-card";
import { PreferencesCard } from "../_components/settings/preferences-card";
import { ProfileCard } from "../_components/settings/profile-card";
import { SecurityCard } from "../_components/settings/security-card";
import { PageHeader } from "../_components/shared/page-header";
import { useSettingsLogic } from "../_hooks/use-settings-logic";


export function SettingsPage() {
  const {
    isMounted,
    user,
    profile,
    name,
    setName,
    bio,
    setBio,
    selectedBadges,
    handleBadgeToggle,
    isSaving,
    isUploading,
    handleSaveProfile,
    handleWithdraw,
    handleDeleteOrganization, // This will be added in the hook later
    handleAvatarUpload,
    avatarInputRef,
  } = useSettingsLogic();
  const { t } = useI18n();

  if (!isMounted || !user) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
      <PageHeader
        title={t('settings.userSettingsTitle')}
        description={t('settings.userSettingsDescription')}
      />
      <div className="grid gap-6">
        <ProfileCard
            user={user}
            profile={profile}
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            selectedBadges={selectedBadges}
            handleBadgeToggle={handleBadgeToggle}
            handleSaveProfile={handleSaveProfile}
            handleAvatarUpload={handleAvatarUpload}
            isSaving={isSaving}
            isUploading={isUploading}
            avatarInputRef={avatarInputRef}
        />
        <PreferencesCard />
        <SecurityCard onWithdraw={handleWithdraw} t={t} />
        <DangerZoneCard onDelete={handleDeleteOrganization} />
      </div>
    </div>
  );
}
