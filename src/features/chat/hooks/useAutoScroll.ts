import { useEffect, useRef } from "react";
import type { ConversationMessage } from "../services/schemas";

export function useAutoScroll(messages: ConversationMessage[]) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousLastMessageKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!messages.length) {
      return;
    }

    const latest = messages[messages.length - 1];
    const latestKey = `${latest._id}-${latest.createdAt.getTime()}`;

    if (previousLastMessageKeyRef.current === latestKey) {
      return;
    }

    previousLastMessageKeyRef.current = latestKey;
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [messages]);

  return bottomRef;
}
