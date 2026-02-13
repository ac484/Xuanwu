"use client";

import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { AVAILABLE_BADGES } from "../../../_constants/badges";
import type { ProfileFormProps } from '../../../_types/settings';

export function ProfileForm({ name, setName, bio, setBio, email, selectedBadges, handleBadgeToggle }: ProfileFormProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="user-name">Display Name</Label>
        <Input id="user-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your public display name" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="user-bio">Bio</Label>
        <Textarea id="user-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about yourself." className="min-h-[100px]" />
      </div>

      <div className="grid gap-2">
        <Label>Expertise</Label>
        <p className="text-sm text-muted-foreground">Select up to 5 areas of expertise to display on your profile.</p>
        <div className="flex flex-wrap gap-4 pt-2">
          {AVAILABLE_BADGES.map(badge => (
            <div key={badge.id} className="flex items-center space-x-2">
              <Checkbox
                id={`badge-${badge.id}`}
                checked={selectedBadges.some(b => b.id === badge.id)}
                onCheckedChange={() => handleBadgeToggle(badge)}
              />
              <label
                htmlFor={`badge-${badge.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {badge.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="user-email">Email</Label>
        <Input id="user-email" defaultValue={email} disabled />
        <p className="text-[10px] text-muted-foreground italic">Email address cannot be changed.</p>
      </div>
    </>
  );
}
