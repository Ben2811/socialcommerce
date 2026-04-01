"use client";
import { Circle } from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/features/shared/utils/cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ConversationPreview } from "../hooks/useConversations";

interface ConversationItemProps {
  conversation: ConversationPreview;
  isSelected: boolean;
  onClick: () => void;
}

function shortTime(date: Date) {
  return isToday(date) ? format(date, "HH:mm") : format(date, "dd/MM");
}

export function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const initials = conversation.username
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
        isSelected && "bg-muted"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar>
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        {conversation.isOnline && (
          <Circle className="absolute right-0 bottom-0 h-3 w-3 fill-green-500 stroke-background stroke-2" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {conversation.username}
          </span>
          {conversation.lastMessageAt && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {shortTime(
                conversation.lastMessageAt instanceof Date
                  ? conversation.lastMessageAt
                  : new Date(conversation.lastMessageAt)
              )}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="truncate text-xs text-muted-foreground">
            {conversation.lastMessage ?? "Bắt đầu cuộc trò chuyện"}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="h-4 min-w-4 shrink-0 rounded-full px-1 text-[10px]"
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}