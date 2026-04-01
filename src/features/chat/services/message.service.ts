import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import type { BaseResponse } from "@/types/global.types";
import {
  GetConversationParamsSchema,
  GetConversationsParamsSchema,
  MarkMessageAsReadParamsSchema,
} from "./schemas";
import type {
  ConversationMessage,
  ConversationsListResponse,
  UnreadCountResponse,
} from "./schemas";

// Re-export all schemas and types
export * from "./schemas";

interface IMessageService {
  getConversation(
    otherUserId: string,
    limit?: number,
    skip?: number,
    token?: string | null,
  ): Promise<BaseResponse<ConversationMessage[]>>;

  getUserConversations(
    limit?: number,
    skip?: number,
    token?: string | null,
  ): Promise<BaseResponse<ConversationsListResponse>>;

  markMessageAsRead(
    messageId: string,
    token?: string | null,
  ): Promise<BaseResponse<null>>;

  getUnreadCount(
    token?: string | null,
  ): Promise<BaseResponse<UnreadCountResponse>>;
}

class MessageService implements IMessageService {
  private normalizeUserId(userId: unknown): string {
    if (typeof userId === "string") {
      const id = userId.trim();
      if (!id) throw new Error("User ID cannot be empty");
      return id;
    }

    if (userId && typeof userId === "object") {
      const obj = userId as Record<string, unknown>;
      const idRaw = obj._id;
      if (typeof idRaw === "string") {
        const id = idRaw.trim();
        if (!id) throw new Error("User ID cannot be empty");
        return id;
      }
    }

    throw new Error(
      "Invalid user ID: expected non-empty string or object with `_id`",
    );
  }

  async getConversation(
    otherUserId: string,
    limit?: number,
    skip?: number,
    token?: string | null,
  ): Promise<BaseResponse<ConversationMessage[]>> {
    const normalizedUserId = this.normalizeUserId(otherUserId);

    const params = GetConversationParamsSchema.parse({
      otherUserId: normalizedUserId,
      limit,
      skip,
    });

    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.messages)
      .addPath(`conversation/${params.otherUserId}`)
      .addSearchParams({
        limit: params.limit,
        skip: params.skip,
      })
      .build();

    return apiClient.get<ConversationMessage[]>(url, token);
  }

  async getUserConversations(
    limit?: number,
    skip?: number,
    token?: string | null,
  ): Promise<BaseResponse<ConversationsListResponse>> {
    const params = GetConversationsParamsSchema.parse({
      limit,
      skip,
    });

    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.messages)
      .addPath("conversations")
      .addSearchParams({
        limit: params.limit,
        skip: params.skip,
      })
      .build();

    return apiClient.get<ConversationsListResponse>(url, token);
  }

  async markMessageAsRead(
    messageId: string,
    token?: string | null,
  ): Promise<BaseResponse<null>> {
    const params = MarkMessageAsReadParamsSchema.parse({ messageId });

    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.messages)
      .addPath(`mark-read/${params.messageId}`)
      .build();

    return apiClient.post<Record<string, never>, null>(url, {}, token);
  }

  async getUnreadCount(
    token?: string | null,
  ): Promise<BaseResponse<UnreadCountResponse>> {
    const url = new URLBuilder()
      .addPath(API_ENDPOINTS.messages)
      .addPath("unread/count")
      .build();

    return apiClient.get<UnreadCountResponse>(url, token);
  }
}

export const messageService = new MessageService();

// Re-export types for convenience
export type {
  GetConversationParams,
  GetConversationsParams,
  MarkMessageAsReadParams,
  PopulatedUser,
  Participant,
  Message,
  ConversationMessage,
  LastMessageObject,
  ConversationSummary,
  ConversationsListResponse,
  UnreadCountResponse,
} from "./schemas";
