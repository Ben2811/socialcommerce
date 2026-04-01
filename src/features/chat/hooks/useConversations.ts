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
                (!readAt || (m.timestamp && m.timestamp > readAt))
            ).length;

      const existing = convMap.get(userId);
      const senderUsername = lastMsg.senderUsername || userStatuses.get(userId)?.username || "Unknown User";
      
      convMap.set(userId, {
        userId,
        username: existing?.username ?? senderUsername,
        lastMessage: lastMsg.content,
        lastMessageAt: lastMsg.timestamp,
        unreadCount,
        isOnline: onlineUsers.has(userId),
      });
    });

    const list = Array.from(convMap.values()).sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
    });

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((c) => c.username.toLowerCase().includes(q));
  }, [messages, openedConversations, onlineUsers, userStatuses, selectedUserId, readTimestamps, search]);

  return conversations;
}
