"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Loader2, MessageSquarePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/features/shared/utils/cn";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetConversations } from "../hooks/useMessageAPI";
import { useChatUIStore } from "../stores/chatUIStore";
import { useWebSocketStore } from "../stores/chatStore";
import { toDateOrUndefined } from "../utils/date-utils";
import { ConversationItem } from "./ConversationItem";
import type { ConversationPreview } from "../hooks/useConversations";
import type { ConversationSummary } from "../services/schemas";

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { selectedUserId, selectConversation, openedConversations } =
    useChatUIStore();
  const { onlineUsers, messages, userStatuses } = useWebSocketStore();

  const { data: apiResponse, isLoading, error } = useGetConversations();

  const conversations = useMemo<ConversationPreview[]>(() => {
    const convMap = new Map<string, ConversationPreview>();
    const currentUserId = user?._id;

    openedConversations.forEach((meta, userId) => {
      convMap.set(userId, {
        userId,
        username: meta.username,
        lastMessage: undefined,
        lastMessageAt: undefined,
        unreadCount: 0,
        isOnline: onlineUsers.has(userId),
      });
    });

    const conversationArray: ConversationSummary[] = Array.isArray(
      apiResponse,
    )
      ? apiResponse
      : apiResponse?.items ?? [];

    conversationArray.forEach((conv) => {
      if (!Array.isArray(conv.participants) || conv.participants.length === 0) {
        return;
      }

      // Extract otherUserId from participants array (participants are now objects)
      const otherUserId =
        currentUserId != null
          ? conv.participants.find((participant) => participant._id !== currentUserId)?._id
          : conv.participants[0]?._id;

      if (!otherUserId) {
        return;
      }

      const localMessages = messages.get(otherUserId) ?? [];
      const lastLocalMessage =
        localMessages.length > 0
          ? localMessages[localMessages.length - 1]
          : undefined;
      const lastLocalMessageAt = toDateOrUndefined(
        (lastLocalMessage as Record<string, unknown> | undefined)?.timestamp ??
          (lastLocalMessage as Record<string, unknown> | undefined)?.createdAt,
      );

      const existing = convMap.get(otherUserId);
      
      // Get username from participants
      const otherParticipant = conv.participants.find(
        (participant) => participant._id !== currentUserId,
      );
      const username =
        existing?.username ??
        otherParticipant?.username ??
        openedConversations.get(otherUserId)?.username ??
        userStatuses.get(otherUserId)?.username ??
        "Người dùng";

      const updatedAt = toDateOrUndefined(conv.updatedAt);

      // Get the last message text from the response object
      const lastMessageText = conv.lastMessage?.content;

      convMap.set(otherUserId, {
        userId: otherUserId,
        username,
        lastMessage: lastLocalMessage?.content ?? lastMessageText ?? undefined,
        lastMessageAt: lastLocalMessageAt ?? updatedAt,
        unreadCount: Math.max(0, conv.unreadCount ?? 0),
        isOnline: onlineUsers.has(otherUserId),
      });
    });

    const list = Array.from(convMap.values()).sort((a, b) => {
      const aTime = toDateOrUndefined(a.lastMessageAt)?.getTime();
      const bTime = toDateOrUndefined(b.lastMessageAt)?.getTime();

      if (aTime == null) return 1;
      if (bTime == null) return -1;

      return bTime - aTime;
    });

    if (!search.trim()) {
      return list;
    }

    const q = search.toLowerCase();
    return list.filter((conversation) =>
      conversation.username.toLowerCase().includes(q),
    );
  }, [
    apiResponse,
    messages,
    onlineUsers,
    openedConversations,
    search,
    user,
    userStatuses,
  ]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên..."
            className="h-8 pl-8 text-xs"
            disabled={isLoading}
            aria-label="Search conversations"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading && !apiResponse ? (
          <div className="flex items-center justify-center gap-2 px-4 py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Đang tải cuộc hội thoại...</span>
          </div>
        ) : error ? (
          <div className="m-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-xs">Lỗi khi tải cuộc hội thoại</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
            <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {search
                ? "Không tìm thấy cuộc hội thoại nào."
                : "Chưa có cuộc hội thoại nào."}
            </p>
          </div>
        ) : (
          <div className="py-1">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.userId}
                conversation={conv}
                isSelected={conv.userId === selectedUserId}
                onClick={() => selectConversation(conv.userId, conv.username)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}