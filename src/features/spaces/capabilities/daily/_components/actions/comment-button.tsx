"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

interface CommentButtonProps {
  count?: number;
  onClick: () => void;
}

export function CommentButton({ count = 0, onClick }: CommentButtonProps) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClick}>
        <MessageCircle className="w-5 h-5 text-muted-foreground" />
      </Button>
      {count > 0 && (
         <span className="text-xs font-bold text-muted-foreground pr-2">{count}</span>
      )}
    </div>
  );
}
