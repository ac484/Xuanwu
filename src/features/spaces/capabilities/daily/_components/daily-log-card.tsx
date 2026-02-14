"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/_components/ui/card";
import { DailyLog, User } from "@/types/domain";
import { ImageCarousel } from "./image-carousel";
import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import { LikeButton } from "./actions/like-button";
import { CommentButton } from "./actions/comment-button";
import { BookmarkButton } from "./actions/bookmark-button";

function SpaceAvatar({ name }: { name: string }) {
    return (
        <Avatar className="w-10 h-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {name?.[0]?.toUpperCase() || 'S'}
            </AvatarFallback>
        </Avatar>
    )
}

function TimeAgo({ date }: { date: any }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        if (!date) return;
        
        const update = () => {
            import('date-fns').then(({ formatDistanceToNow }) => {
                const d = date.toDate ? date.toDate() : new Date(date);
                setTimeAgo(formatDistanceToNow(d, { addSuffix: true }));
            });
        };
        
        update();
        const intervalId = setInterval(update, 60000); // Update every minute
        return () => clearInterval(intervalId);

    }, [date]);

    return (
        <span suppressHydrationWarning>
            {timeAgo || 'Syncing...'}
        </span>
    );
}

interface DailyLogCardProps {
  log: DailyLog;
  currentUser: User | null;
  onOpen: () => void;
}

export function DailyLogCard({ log, currentUser, onOpen }: DailyLogCardProps) {

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm transition-all duration-300">
      <div className="p-4 flex items-center gap-3">
        <SpaceAvatar name={log.spaceName} />
        <div className="flex flex-col">
          <span className="font-bold text-sm">{log.spaceName}</span>
          <span className="text-xs text-muted-foreground">
            by {log.author.name} • <TimeAgo date={log.createdAt} />
          </span>
        </div>
      </div>

      {log.photoURLs && log.photoURLs.length > 0 && (
        <div onClick={onOpen} className="aspect-square relative bg-black/5 cursor-pointer">
           <ImageCarousel images={log.photoURLs} />
        </div>
      )}

      <div className="px-2 pt-2 pb-1 flex items-center justify-between">
        <div className="flex items-center">
            <LikeButton log={log} currentUser={currentUser} />
            <CommentButton onClick={onOpen} count={log.commentCount} />
        </div>
        <BookmarkButton logId={log.id} />
      </div>
      
      <div className="px-4 pb-4 cursor-pointer" onClick={onOpen}>
        <div className={'text-sm leading-relaxed line-clamp-2'}>
            <span className="font-bold mr-2">{log.author.name}</span>
            {log.content}
        </div>
      </div>
    </Card>
  );
}
