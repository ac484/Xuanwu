"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { User, Loader2 } from "lucide-react";
import { AvatarSection } from "./avatar-section";
import { ProfileForm } from "./profile-form";
import type { ProfileCardProps } from '../../../_types/settings';

export function ProfileCard({
  user,
  profile,
  name,
  setName,
  bio,
  setBio,
  selectedBadges,
  handleBadgeToggle,
  handleSaveProfile,
  handleAvatarUpload,
  isSaving,
  isUploading,
  avatarInputRef,
}: ProfileCardProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary mb-1">
          <User className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Personal Identity</span>
        </div>
        <CardTitle className="font-headline">Profile</CardTitle>
        <CardDescription>Manage your public identity and expertise.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AvatarSection
            profile={profile}
            name={name}
            isUploading={isUploading}
            avatarInputRef={avatarInputRef}
            handleAvatarUpload={handleAvatarUpload}
        />
        <ProfileForm
            name={name}
            setName={setName}
            bio={bio}
            setBio={setBio}
            email={user?.email || ""}
            selectedBadges={selectedBadges}
            handleBadgeToggle={handleBadgeToggle}
        />
      </CardContent>
      <CardFooter className="bg-muted/20 border-t">
        <Button onClick={handleSaveProfile} disabled={isSaving || isUploading} className="ml-auto font-bold uppercase text-xs tracking-widest">
          {isSaving || isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isSaving || isUploading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
