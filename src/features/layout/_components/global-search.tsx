"use client";

import { Globe, Layers, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/app/_components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";
import { Organization, MemberReference } from "@/types/domain";
import { Space } from "@/types/space";

interface GlobalSearchProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organizations: Organization[];
  spaces: Space[];
  members: MemberReference[];
  activeOrgId: string | null;
  onSwitchOrg: (org: Organization) => void;
}

export function GlobalSearch({
  isOpen,
  onOpenChange,
  organizations,
  spaces,
  members,
  activeOrgId,
  onSwitchOrg,
}: GlobalSearchProps) {
  const router = useRouter();

  const handleSelect = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Dimensions">
          {organizations.map((org) => (
            <CommandItem key={org.id} onSelect={() => handleSelect(() => onSwitchOrg(org))}>
              <Globe className="mr-2 h-4 w-4 text-primary" />
              <span>{org.name}</span>
              {activeOrgId === org.id && <Badge variant="outline" className="text-[8px] h-4 ml-auto">Current</Badge>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Spaces">
          {spaces.map((space) => (
            <CommandItem key={space.id} onSelect={() => handleSelect(() => router.push(`/spaces/${space.id}`))}>
              <Layers className="mr-2 h-4 w-4 text-primary" />
              <span>{space.name}</span>
              <span className="text-[9px] text-muted-foreground font-mono ml-auto">{space.id.toUpperCase()}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="People">
          {members.map((member) => (
            <CommandItem key={member.id} onSelect={() => handleSelect(() => router.push('/account/members'))}>
              <User className="mr-2 h-4 w-4 text-primary" />
              <span>{member.name}</span>
              <span className="text-[9px] text-muted-foreground ml-auto">{member.email}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
