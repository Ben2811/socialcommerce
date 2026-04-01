"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/features/shared/utils/cn";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useChatIntegration } from "../hooks/useChatIntegration";
import { useConversationInfinite } from "../hooks/useConversationInfinite";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useWebSocketStore } from "../stores/chatStore";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { EmptyThreadState } from "./EmptyThreadState";
import { Loader2, AlertCircle, ChevronUp } from "lucide-react";
import type { ConversationMessage } from "../services/schemas";

interface MessageThreadProps {
  userId: string | null;
  className?: string;
}

export function MessageThread({ userId, className }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef(0);

  const { user } = useAuth();
  const { messageError } = useWebSocketStore();

  // Get target user ID and basic functions
  const { targetUserId, sendMessage, markAsRead } = useChatIntegration({
    otherUserId: userId ?? undefined,
    autoMarkAsRead: false,
  });

  // Fetch messages with infinite scroll pagination
  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error,
  } = useConversationInfinite({
    otherUserId: targetUserId,
    enabled: !!targetUserId,
  });

  // Detect when user scrolls to top
  const isAtTop = useScrollToTop(scrollRef, {
    threshold: 100,
    enabled: !!targetUserId && !isFetching && !!hasNextPage,
  });

  // Load older messages when scrolled to top
  useEffect(() => {
    if (isAtTop && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [isAtTop, hasNextPage, isFetching, fetchNextPage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > previousMessageCountRef.current) {
      previousMessageCountRef.current = messages.length;
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [messages.length]);

  // Mark incoming messages as read
  useEffect(() => {
    messages.forEach((msg: ConversationMessage) => {
      if (msg.senderId._id !== user?._id && !msg.isRead) {
        markAsRead(msg._id);
      }
    });
  }, [messages, user?._id, markAsRead]);

  const canChat = !!targetUserId && !!user;
  const hasError = error || messageError;

  if (!userId) {
    return (
      <div className={cn("flex flex-col", className)}>
        <EmptyThreadState />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Messages Container */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3 overflow-y-auto">
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : hasError && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4">
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {error?.message || messageError?.message || "Failed to load messages"}
              </span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-8">
            <p className="text-xs text-muted-foreground">
              Hãy bắt đầu cuộc trò chuyện!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Loading indicator at top when fetching older messages */}
            {isFetching && (
              <div className="flex items-center justify-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Đang tải tin nhắn cũ hơn...
                </span>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg: ConversationMessage) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isSentByMe={msg.senderId._id === user?._id}
              />
            ))}

            {/* Load more older messages button */}
            {hasNextPage && !isFetching && (
              <button
                onClick={() => fetchNextPage()}
                className="mx-auto my-2 flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80"
              >
                <ChevronUp className="h-3 w-3" />
                Tải thêm tin nhắn cũ hơn
              </button>
            )}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <Separator />

      {/* Message Input */}
      <MessageInput onSend={sendMessage} disabled={!canChat} />
    </div>
  );
}