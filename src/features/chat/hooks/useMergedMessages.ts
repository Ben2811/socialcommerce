import { useMemo } from "react";
import type { ConversationMessage } from "../services/schemas";
import { toDateOrEpoch } from "../utils/date-utils";

interface NormalizedMessage extends ConversationMessage {
  createdAt: Date;
  updatedAt: Date;
}

function normalizeMessage(
  message: unknown,
  index: number,
  currentUserId: string | undefined,
  targetUserId: string | undefined,
  currentUsername: string | undefined,
): NormalizedMessage {
  const msg = message as Record<string, unknown>;
  const senderId = String(msg.senderId ?? "");
  const senderUsername =
    typeof msg.senderUsername === "string"
      ? msg.senderUsername
      : senderId === currentUserId
        ? (currentUsername ?? "Bạn")
        : "Người dùng";

  const createdAt = toDateOrEpoch(msg.createdAt ?? msg.timestamp ?? msg.updatedAt);
  const messageId =
    typeof msg._id === "string"
      ? msg._id
      : typeof msg.messageId === "string"
        ? msg.messageId
        : `temp-${senderId}-${createdAt.getTime()}-${index}`;

  const recipientId =
    typeof msg.recipientId === "string"
      ? msg.recipientId
      : senderId === currentUserId
        ? (targetUserId ?? "")
        : (currentUserId ?? "");

  return {
    _id: messageId,
    senderId: {
      _id: senderId,
      username: senderUsername,
    },
    recipientId: {
      _id: recipientId,
      username: recipientId === currentUserId ? (currentUsername ?? "Bạn") : "Người dùng",
    },
    content: typeof msg.content === "string" ? msg.content : "",
    isRead: typeof msg.isRead === "boolean" ? msg.isRead : senderId === currentUserId,
    createdAt,
    updatedAt: toDateOrEpoch(msg.updatedAt ?? createdAt),
  };
}

export function useMergedMessages(
  paginatedMessages: ConversationMessage[],
  realtimeMessages: Map<string, unknown[]>,
  targetUserId: string | undefined,
  currentUserId: string | undefined,
  currentUsername: string | undefined,
): ConversationMessage[] {
  return useMemo(() => {
    if (!targetUserId) return [];

    const liveMessages = realtimeMessages.get(targetUserId) ?? [];
    const normalizedLive = liveMessages.map((msg, i) =>
      normalizeMessage(msg, i, currentUserId, targetUserId, currentUsername),
    );

    const merged = [...paginatedMessages, ...normalizedLive];
    const deduped = new Map<string, NormalizedMessage>();

    merged.forEach((message, index) => {
      const normalized: NormalizedMessage = {
        ...message,
        createdAt: toDateOrEpoch(message.createdAt),
        updatedAt: toDateOrEpoch(message.updatedAt ?? message.createdAt),
      };

      const fallbackKey = `${normalized.senderId._id}-${normalized.content}-${normalized.createdAt.getTime()}-${index}`;
      const key = normalized._id || fallbackKey;

      if (!deduped.has(key) || normalized.updatedAt.getTime() >= (deduped.get(key)?.updatedAt.getTime() ?? 0)) {
        deduped.set(key, normalized);
      }
    });

    return Array.from(deduped.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }, [paginatedMessages, realtimeMessages, targetUserId, currentUserId, currentUsername]);
}
