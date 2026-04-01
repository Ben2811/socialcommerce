"use client";
import { useEffect, useRef, createElement } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { useWebSocketStore } from "../stores/chatStore";
import { useChatUIStore } from "../stores/chatUIStore";
import { useAuth } from "@/features/auth/providers/AuthProvider";

export function useNewMessageNotification() {
  const messages = useWebSocketStore((s) => s.messages);
  const { isOpen, isMinimized, selectedUserId, openChat, selectConversation } =
    useChatUIStore();
  const { user } = useAuth();

  // Track message counts per conversation to detect new arrivals
  const prevCountsRef = useRef(new Map<string, number>());
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      messages.forEach((msgs, userId) => {
        prevCountsRef.current.set(userId, msgs.length);
      });
      isInitializedRef.current = true;
      return;
    }

    messages.forEach((msgs, userId) => {
      const prevCount = prevCountsRef.current.get(userId) ?? 0;

      if (msgs.length > prevCount) {
        const newMessages = msgs.slice(prevCount);

        newMessages.forEach((msg) => {
          const isSentByMe = msg.senderId === user?._id;
          const isConversationVisible =
            isOpen && !isMinimized && selectedUserId === userId;

          if (!isSentByMe && !isConversationVisible) {
            toast(msg.senderUsername, {
              description: msg.content.length > 60
                ? `${msg.content.slice(0, 60)}…`
                : msg.content,
              icon: createElement(MessageSquare, { className: "h-4 w-4" }),
              duration: 5000,
              action: {
                label: "Xem",
                onClick: () => {
                  if (!isOpen) {
                    openChat(userId, msg.senderUsername);
                  } else {
                    selectConversation(userId, msg.senderUsername);
                  }
                },
              },
            });
          }
        });

        prevCountsRef.current.set(userId, msgs.length);
      }
    });
  }, [messages, isOpen, isMinimized, selectedUserId, user?._id, openChat, selectConversation]);
}