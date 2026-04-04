"use client";

import { useEffect, useMemo, useRef } from "react";
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

function toDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function isObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

export function MessageThread({ userId, className }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousLastMessageKeyRef = useRef<string | null>(null);
  const markedAsReadRef = useRef<Set<string>>(new Set());

  const { user } = useAuth();
  const { messageError, messages: realtimeMessages } = useWebSocketStore();

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

  const mergedMessages = useMemo<ConversationMessage[]>(() => {
    if (!targetUserId) {
      return [];
    }

    const liveMessages = realtimeMessages.get(targetUserId) ?? [];

    const normalizedLive: ConversationMessage[] = liveMessages.map(
      (message, index) => {
        const dynamicMessage = message as unknown as Record<string, unknown>;
        const senderId = String(dynamicMessage.senderId ?? "");
        const senderUsername =
          typeof dynamicMessage.senderUsername === "string"
            ? dynamicMessage.senderUsername
            : senderId === user?._id
              ? (user?.username ?? "Bạn")
              : "Người dùng";

        const createdAt = toDate(
          dynamicMessage.createdAt ??
            dynamicMessage.timestamp ??
            dynamicMessage.updatedAt,
        );
        const messageId =
          typeof dynamicMessage._id === "string"
            ? dynamicMessage._id
            : typeof dynamicMessage.messageId === "string"
              ? dynamicMessage.messageId
              : `temp-${senderId}-${createdAt.getTime()}-${index}`;

        const recipientId =
          typeof dynamicMessage.recipientId === "string"
            ? dynamicMessage.recipientId
            : senderId === user?._id
              ? targetUserId
              : (user?._id ?? "");

        return {
          _id: messageId,
          senderId: {
            _id: senderId,
            username: senderUsername,
          },
          recipientId: {
            _id: recipientId,
            username: recipientId === user?._id ? (user?.username ?? "Bạn") : "Người dùng",
          },
          content:
            typeof dynamicMessage.content === "string"
              ? dynamicMessage.content
              : "",
          isRead:
            typeof dynamicMessage.isRead === "boolean"
              ? dynamicMessage.isRead
              : senderId === user?._id,
          createdAt,
          updatedAt: toDate(dynamicMessage.updatedAt ?? createdAt),
        };
      },
    );

    const merged = [...messages, ...normalizedLive];
    const deduped = new Map<string, ConversationMessage>();

    merged.forEach((message, index) => {
      const normalized: ConversationMessage = {
        ...message,
        createdAt: toDate(message.createdAt),
        updatedAt: toDate(message.updatedAt ?? message.createdAt),
      };

      const fallbackKey = `${normalized.senderId._id}-${normalized.content}-${normalized.createdAt.getTime()}-${index}`;
      const key = normalized._id || fallbackKey;
      const existing = deduped.get(key);

      if (!existing) {
        deduped.set(key, normalized);
        return;
      }

      if (normalized.updatedAt.getTime() >= existing.updatedAt.getTime()) {
        deduped.set(key, normalized);
      }
    });

    return Array.from(deduped.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }, [messages, realtimeMessages, targetUserId, user?._id, user?.username]);

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

  useEffect(() => {
    markedAsReadRef.current.clear();
    previousLastMessageKeyRef.current = null;
  }, [targetUserId]);

  // Auto-scroll to bottom only when latest message changes.
  // Loading older pages should keep current viewport stable.
  useEffect(() => {
    if (!mergedMessages.length) {
      return;
    }

    const latest = mergedMessages[mergedMessages.length - 1];
    const latestKey = `${latest._id}-${latest.createdAt.getTime()}`;

    if (previousLastMessageKeyRef.current === latestKey) {
      return;
    }

    previousLastMessageKeyRef.current = latestKey;
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [mergedMessages]);

  // Mark incoming messages as read
  useEffect(() => {
    mergedMessages.forEach((msg: ConversationMessage) => {
      if (
        msg.senderId._id !== user?._id &&
        !msg.isRead &&
        isObjectId(msg._id) &&
        !markedAsReadRef.current.has(msg._id)
      ) {
        markedAsReadRef.current.add(msg._id);
        markAsRead(msg._id);
      }
    });
  }, [mergedMessages, user?._id, markAsRead]);

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
        {isLoading && mergedMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : hasError && mergedMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4">
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {error?.message || messageError?.message || "Failed to load messages"}
              </span>
            </div>
          </div>
        ) : mergedMessages.length === 0 ? (
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
            {mergedMessages.map((msg: ConversationMessage) => (
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