"use client";

import { UserPlus } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { MemberReference, ScheduleItem } from "@/types/domain";


interface AssignMemberDropdownProps {
  item: ScheduleItem;
  members: MemberReference[];
  assignMember: (item: ScheduleItem, memberId: string) => Promise<void>;
  unassignMember: (item: ScheduleItem, memberId: string) => Promise<void>;
}

/**
 * @fileoverview AssignMemberDropdown - A self-contained component for assigning members to a schedule item.
 * @description REFACTORED: This component is now context-agnostic. It receives its action
 * handlers (`assignMember`, `unassignMember`) as props, allowing it to be used in
 * both space-specific and organization-wide contexts.
 */
export function AssignMemberDropdown({ item, members, assignMember, unassignMember }: AssignMemberDropdownProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-5 h-5 text-muted-foreground hover:text-primary">
          <UserPlus className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Assign Member</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {members.map((member) => (
          <DropdownMenuCheckboxItem
            key={member.id}
            checked={item.assigneeIds.includes(member.id)}
            onSelect={(e) => e.preventDefault()} // Prevents menu from closing on item click
            onCheckedChange={(isChecked) => {
              if (isChecked) {
                assignMember(item, member.id);
              } else {
                unassignMember(item, member.id);
              }
            }}
          >
            {member.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
