import type { RefObject, ChangeEvent } from 'react';

import type { User, UserProfile, ExpertiseBadge } from '@/types/domain';

export interface PageHeaderProps {
  title: string;
  description?: string;
}

export interface SecurityCardProps {
  onWithdraw: () => void;
  t: (key: string) => string;
}

export interface AvatarSectionProps {
  profile: UserProfile | null;
  name: string;
  isUploading: boolean;
  avatarInputRef: RefObject<HTMLInputElement>;
  handleAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface ProfileFormProps {
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  email: string;
  selectedBadges: ExpertiseBadge[];
  handleBadgeToggle: (badge: ExpertiseBadge) => void;
}

export interface ProfileCardProps {
  user: User | null;
  profile: UserProfile | null;
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  selectedBadges: ExpertiseBadge[];
  handleBadgeToggle: (badge: ExpertiseBadge) => void;
  handleSaveProfile: () => void;
  handleAvatarUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  isSaving: boolean;
  isUploading: boolean;
  avatarInputRef: RefObject<HTMLInputElement>;
}
