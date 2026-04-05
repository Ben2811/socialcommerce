"use client";
import { format, isToday, isThisWeek } from "date-fns";
import { cn } from "@/features/shared/utils/cn";
import type { ConversationMessage } from "../services/schemas";

interface MessageBubbleProps {
  message: ConversationMessage;
  isSentByMe: boolean;
}

function formatTimestamp(date: Date | undefined): string {
  if (!date) return "";
  if (isToday(date)) return format(date, "HH:mm");
  if (isThisWeek(date)) return format(date, "EEE HH:mm");
  return format(date, "dd/MM HH:mm");
}

export function MessageBubble({ message, isSentByMe }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex max-w-[72%] flex-col gap-1",
        isSentByMe ? "items-end self-end" : "items-start self-start",
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-3 py-2 text-sm leading-relaxed wrap-break-word",
          isSentByMe
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm bg-muted text-foreground",
        )}
      >
        {message.content}
      </div>
      <span className="px-1 text-[11px] text-muted-foreground">
        {formatTimestamp(message.createdAt)}
      </span>
    </div>
  );
}