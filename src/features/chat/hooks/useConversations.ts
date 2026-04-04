"use client";
import { useMemo } from "react";
import { useWebSocketStore } from "../stores/chatStore";
import { useChatUIStore } from "../stores/chatUIStore";

export interface ConversationPreview {
  userId: string;
  username: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  isOnline: boolean;
}

function toDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return undefined;
}

export function useConversations(search: string = "") {
  const { messages, onlineUsers, userStatuses } = useWebSocketStore();
  const { openedConversations, selectedUserId, readTimestamps } =
    useChatUIStore();

  const conversations = useMemo<ConversationPreview[]>(() => {
    const convMap = new Map<string, ConversationPreview>();

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

    messages.forEach((msgs, userId) => {
      if (!msgs.length) return;
      const lastMsg = msgs[msgs.length - 1];
      const readAt = readTimestamps.get(userId);
      const unreadCount =
        selectedUserId === userId
          ? 0
          : msgs.filter(
              (m) =>
                m.senderId === userId &&
                (!readAt ||
                  (toDate(m.timestamp ?? m.createdAt)?.getTime() ?? 0) >
                    readAt.getTime())
            ).length;

      const existing = convMap.get(userId);
      const senderUsername = lastMsg.senderUsername || userStatuses.get(userId)?.username || "Unknown User";
      const lastMessageAt = toDate(
        lastMsg.timestamp ?? lastMsg.createdAt,
      );
      
      convMap.set(userId, {
        userId,
        username: existing?.username ?? senderUsername,
        lastMessage: lastMsg.content,
        lastMessageAt,
        unreadCount,
        isOnline: onlineUsers.has(userId),
      });
    });

    const list = Array.from(convMap.values()).sort((a, b) => {
      const aTime = toDate(a.lastMessageAt)?.getTime();
      const bTime = toDate(b.lastMessageAt)?.getTime();

      if (aTime == null) return 1;
      if (bTime == null) return -1;

      return bTime - aTime;
    });

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((c) => c.username.toLowerCase().includes(q));
  }, [messages, openedConversations, onlineUsers, userStatuses, selectedUserId, readTimestamps, search]);

  return conversations;
}
