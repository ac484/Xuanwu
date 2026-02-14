"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';

import { Heart } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { DailyLog, User } from "@/types/domain";

import { useDailyActions } from '../../_hooks/use-daily-actions';

interface LikeButtonProps {
  log: DailyLog;
  currentUser: User | null;
}

export function LikeButton({ log, currentUser }: LikeButtonProps) {
  const { toggleLike } = useDailyActions();
  
  const initialIsLiked = useMemo(() => 
    currentUser ? log.likes?.includes(currentUser.id) ?? false : false,
    [log.likes, currentUser]
  );
  const initialLikeCount = useMemo(() => log.likeCount || 0, [log.likeCount]);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleToggleLike = useCallback(() => {
    if (!currentUser) return;
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    toggleLike(log.id).catch(() => {
      setIsLiked(initialIsLiked);
      setLikeCount(initialLikeCount);
    });
  }, [isLiked, likeCount, toggleLike, log.id, currentUser, initialIsLiked, initialLikeCount]);

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
