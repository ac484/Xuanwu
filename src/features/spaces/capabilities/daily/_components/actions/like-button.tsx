"use client";

import { useState, useEffect, useCallback } from 'react';
import { useDailyActions } from '../../_hooks/use-daily-actions';
import { DailyLog, User } from "@/types/domain";
import { Button } from "@/app/_components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  log: DailyLog;
  currentUser: User | null;
}

export function LikeButton({ log, currentUser }: LikeButtonProps) {
  const { toggleLike } = useDailyActions();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    setIsLiked(currentUser ? log.likes?.includes(currentUser.id) ?? false : false);
    setLikeCount(log.likeCount || 0);
  }, [log, currentUser]);

  const handleToggleLike = useCallback(() => {
    if (!currentUser) return;
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    toggleLike(log.id).catch(() => {
      setIsLiked(currentUser ? log.likes?.includes(currentUser.id) ?? false : false);
      setLikeCount(log.likeCount || 0);
    });
  }, [isLiked, likeCount, toggleLike, log, currentUser]);

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleToggleLike}>
        <Heart
          className={cn(
            "w-5 h-5 transition-all",
            isLiked ? "text-red-500 fill-red-500" : "text-muted-foreground"
          )}
        />
      </Button>
      {likeCount > 0 && (
         <span className="text-xs font-bold text-muted-foreground pr-2">{likeCount}</span>
      )}
    </div>
  );
}
