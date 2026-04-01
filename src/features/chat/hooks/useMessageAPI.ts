"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { messageService } from "../services/message.service";
import type {
  ConversationMessage,
  ConversationsListResponse,
  UnreadCountResponse,
} from "../services/message.service";

export const MESSAGE_QUERY_KEYS = {
  all: ["messages"] as const,
  conversation: (otherUserId: string, limit: number, skip: number) =>
    [...MESSAGE_QUERY_KEYS.all, "conversation", otherUserId, limit, skip] as const,
  conversations: (limit: number, skip: number) =>
    [...MESSAGE_QUERY_KEYS.all, "conversations", limit, skip] as const,
  unreadCount: () => [...MESSAGE_QUERY_KEYS.all, "unreadCount"] as const,
};

export function useGetConversation(
  otherUserId: string,
  limit: number = 50,
  skip: number = 0,
) {
  const { getToken } = useAuth();

  // Ensure otherUserId is always a valid string
  const normalizedUserId = typeof otherUserId === "string" ? otherUserId : String(otherUserId ?? "");

  return useQuery<ConversationMessage[]>({
    queryKey: MESSAGE_QUERY_KEYS.conversation(normalizedUserId, limit, skip),
    queryFn: async () => {
      const token = await getToken();
      const response = await messageService.getConversation(
        normalizedUserId,
        limit,
        skip,
        token,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch conversation");
      }

      return response.data;
    },
    enabled: Boolean(normalizedUserId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useGetConversations(
  limit: number = 50,
  skip: number = 0,
) {
  const { getToken } = useAuth();

  return useQuery<ConversationsListResponse>({
    queryKey: MESSAGE_QUERY_KEYS.conversations(limit, skip),
    queryFn: async () => {
      const token = await getToken();
      const response = await messageService.getUserConversations(
        limit,
        skip,
        token,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch conversations");
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });
}

export function useMarkMessageAsRead() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const token = await getToken();
      const response = await messageService.markMessageAsRead(messageId, token);

      if (!response.success) {
        throw new Error(response.message || "Failed to mark message as read");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MESSAGE_QUERY_KEYS.unreadCount(),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGE_QUERY_KEYS.all,
      });
    },
  });
}

export function useGetUnreadCount() {
  const { getToken } = useAuth();

  return useQuery<UnreadCountResponse>({
    queryKey: MESSAGE_QUERY_KEYS.unreadCount(),
    queryFn: async () => {
      const token = await getToken();
      const response = await messageService.getUnreadCount(token);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch unread count");
      }

      return response.data;
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60,
  });
}