"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useWebSocketStore } from "../stores/chatStore";
import { useChatUIStore } from "../stores/chatUIStore";
import {
  useGetConversation,
  useGetUnreadCount,
  useMarkMessageAsRead,
} from "./useMessageAPI";
import { useMessages } from "./useMessages";
import type { ConversationMessage } from "../services/message.service";

interface UseChatIntegrationOptions {
  otherUserId?: string;
  autoMarkAsRead?: boolean;
  limit?: number;
  skip?: number;
}

interface ClientMessage {
  messageId: string;
  senderId: string;
  senderUsername?: string;
  content: string;
  timestamp: Date;
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

function toClientMessage(message: ConversationMessage): ClientMessage {
  return {
    messageId: message._id,
    senderId: message.senderId._id,
    senderUsername: message.senderId.username,
    content: message.content,
    timestamp: toDate(message.createdAt),
  };
}

export function useChatIntegration(options: UseChatIntegrationOptions = {}) {
  const { otherUserId, autoMarkAsRead = true, limit = 50, skip = 0 } = options;

  const { user } = useAuth();
  const { selectedUserId } = useChatUIStore();
  const { addMessage, setMessageError } = useWebSocketStore();

  // Ensure targetUserId is always a valid string (not an object)
  const rawTargetUserId = otherUserId || selectedUserId || "";
  const targetUserId = typeof rawTargetUserId === "string" ? rawTargetUserId : "";

  const {
    data: conversationData,
    isLoading: isLoadingAPI,
    error: apiError,
  } = useGetConversation(targetUserId, limit, skip);

  const { data: unreadCount, refetch: refetchUnreadCount } =
    useGetUnreadCount();
  const { mutate: markAsRead, isPending: isMarkingAsRead } =
    useMarkMessageAsRead();

  const { sendMessage: sendWebSocketMessage } = useMessages(targetUserId);

  const initializedConversationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!targetUserId) {
      initializedConversationRef.current = null;
      return;
    }

    if (!conversationData || initializedConversationRef.current === targetUserId) {
      return;
    }

    initializedConversationRef.current = targetUserId;

    conversationData.forEach((message) => {
      addMessage(targetUserId, toClientMessage(message) as never);
    });
  }, [conversationData, targetUserId, addMessage]);

  useEffect(() => {
    if (!apiError) {
      return;
    }

    setMessageError({
      code: "API_ERROR",
      message: apiError.message || "Failed to load conversation",
    });
  }, [apiError, setMessageError]);

  const handleMarkAsRead = useCallback(
    (messageId: string) => {
      if (!autoMarkAsRead) {
        return;
      }

      markAsRead(messageId, {
        onSuccess: () => {
          refetchUnreadCount();
        },
        onError: (error) => {
          console.error("Failed to mark message as read:", error);
        },
      });
    },
    [autoMarkAsRead, markAsRead, refetchUnreadCount],
  );

  const sendMessage = useCallback(
    (content: string) => {
      if (!targetUserId || !user) {
        setMessageError({
          code: "INVALID_STATE",
          message: "Cannot send message: missing user or target user ID",
        });
        return;
      }

      sendWebSocketMessage(content);
    },
    [targetUserId, user, sendWebSocketMessage, setMessageError],
  );

  return {
    targetUserId,
    isLoading: isLoadingAPI,
    isMarkingAsRead,
    unreadCount: unreadCount?.unreadCount ?? 0,
    sendMessage,
    markAsRead: handleMarkAsRead,
    refetchUnreadCount,
  };
}