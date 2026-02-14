"use client";

import { Loader2, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

import type { AvatarSectionProps } from '../../../_types/settings';

export function AvatarSection({ profile, name, isUploading, avatarInputRef, handleAvatarUpload }: AvatarSectionProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar className="w-20 h-20 border-2 border-primary/20">
          <AvatarImage src={profile?.photoURL} />
          <AvatarFallback className="text-2xl font-bold bg-primary/5 text-primary">
            {name?.[0]}
          </AvatarFallback>
        </Avatar>
        {isUploading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-full"><Loader2 className="animate-spin text-primary" /></div>}
      </div>
      <div className="space-y-2">
        <Button onClick={() => avatarInputRef.current?.click()} disabled={isUploading}>
          <Upload className="w-4 h-4 mr-2" /> Upload Image
        </Button>
        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB.</p>
        <Input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
      </div>
    </div>
  );
}
