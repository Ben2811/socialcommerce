"use client";
import { useCallback } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useWebSocketStore } from "../stores/chatStore";
import { SendMessagePayloadSchema, ClientEvents } from "../types";

interface ClientMessage {
  messageId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: Date;
}

export function useMessages(userId: string) {
  const {
    socket,
    isConnected,
    messageLoading,
    messageError,
    getConversation,
    addMessage,
    setMessageLoading,
    setMessageError,
    clearMessages,
  } = useWebSocketStore();

  const { user } = useAuth();

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected) {
        setMessageError({
          code: "NOT_CONNECTED",
          message: "Not connected to server",
        });
        return;
      }

      if (!userId) {
        setMessageError({
          code: "INVALID_USER",
          message: "User ID is required",
        });
        return;
      }

      const result = SendMessagePayloadSchema.safeParse({
        recipientId: userId,
        content,
      });

      if (!result.success) {
        setMessageError({
          code: "INVALID_PAYLOAD",
          message: "Invalid message payload",
        });
        return;
      }

      if (user) {
        const optimisticMessage: ClientMessage = {
          messageId: `temp-${Date.now()}`,
          senderId: user._id,
          senderUsername: user.username,
          content,
          timestamp: new Date(),
        };
        addMessage(userId, optimisticMessage as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      }

      setMessageLoading(userId);
      socket.emit(ClientEvents.SEND_MESSAGE, result.data);
    },
    [
      userId,
      socket,
      isConnected,
      user,
      addMessage,
      setMessageLoading,
      setMessageError,
    ],
  );

  return {
    messages: getConversation(userId),
    isLoading: messageLoading === userId,
    error: messageError,
    sendMessage,
    clearMessages,
  };
}