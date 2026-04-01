"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { messageService } from "../services/message.service";
import type { ConversationMessage } from "../services/schemas";

const PAGE_SIZE = 50;

export const CONVERSATION_INFINITE_QUERY_KEYS = {
  all: ["messagesInfinite"] as const,
  byUser: (otherUserId: string) =>
    [...CONVERSATION_INFINITE_QUERY_KEYS.all, otherUserId] as const,
};

interface UseConversationInfiniteOptions {
  otherUserId: string;
  pageSize?: number;
  enabled?: boolean;
}

/**
 * Hook for fetching conversation messages with infinite scroll pagination.
 * Messages are fetched in pages, oldest first.
 * When user scrolls to top, fetches older messages.
 */
export function useConversationInfinite({
  otherUserId,
  pageSize = PAGE_SIZE,
  enabled = true,
}: UseConversationInfiniteOptions) {
  const { getToken } = useAuth();

  // Normalize userId to string
  const normalizedUserId =
    typeof otherUserId === "string" ? otherUserId : String(otherUserId ?? "");

  const query = useInfiniteQuery<ConversationMessage[], Error>({
    queryKey: CONVERSATION_INFINITE_QUERY_KEYS.byUser(normalizedUserId),
    queryFn: async ({ pageParam = 0 }) => {
      const token = await getToken();
      const skip = (pageParam as number) * pageSize;

      const response = await messageService.getConversation(
        normalizedUserId,
        pageSize,
        skip,
        token
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch conversation");
      }

      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we got fewer items than pageSize, no more pages exist
      if (lastPage.length < pageSize) {
        return undefined;
      }
      // Next page index is total pages loaded
      return allPages.length;
    },
    enabled: enabled && Boolean(normalizedUserId),
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  // Flatten pages into single array
  const messages = query.data?.pages.flat() ?? [];

  return {
    messages,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    error: query.error,
  };
}