import { useEffect, useRef } from "react";
import type { ConversationMessage } from "../services/schemas";

function isObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

export function useMarkMessagesAsRead(
  messages: ConversationMessage[],
  currentUserId: string | undefined,
  markAsRead: (messageId: string) => void,
) {
  const markedAsReadRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    messages.forEach((msg) => {
      if (
        msg.senderId._id !== currentUserId &&
        !msg.isRead &&
        isObjectId(msg._id) &&
        !markedAsReadRef.current.has(msg._id)
      ) {
        markedAsReadRef.current.add(msg._id);
        markAsRead(msg._id);
      }
    });
  }, [messages, currentUserId, markAsRead]);
}
