"use client";
import { useCallback } from "react";
import { useWebSocketStore } from "../stores/chatStore";
import {
  ClientEvents,
  SendMessagePayloadSchema,
  CheckUserStatusPayloadSchema,
} from "../types";

export function useWebSocket() {
  const { socket, isConnected, setMessageError } = useWebSocketStore();

  const sendMessage = useCallback(
    (recipientId: string, content: string) => {
      if (!socket || !isConnected) {
        setMessageError({ code: "NOT_CONNECTED", message: "Not connected to server" });
        return;
      }

      const result = SendMessagePayloadSchema.safeParse({ recipientId, content });
      if (!result.success) {
        setMessageError({ code: "INVALID_PAYLOAD", message: "Invalid message payload" });
        return;
      }

      socket.emit(ClientEvents.SEND_MESSAGE, result.data);
    },
    [socket, isConnected, setMessageError]
  );

  const checkUserStatus = useCallback(
    (userId: string) => {
      if (!socket || !isConnected) return;

      const result = CheckUserStatusPayloadSchema.safeParse({ userId });
      if (!result.success) return;

      socket.emit(ClientEvents.CHECK_USER_STATUS, result.data);
    },
    [socket, isConnected]
  );

  return { isConnected, sendMessage, checkUserStatus };
}