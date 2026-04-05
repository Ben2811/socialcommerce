import { z } from "zod";

// ============================================================================
// Parameter Schemas
// ============================================================================

export const GetConversationParamsSchema = z.object({
  otherUserId: z.string().min(1),
  limit: z.number().int().positive().default(50),
  skip: z.number().int().nonnegative().default(0),
});

export const GetConversationsParamsSchema = z.object({
  limit: z.number().int().positive().default(50),
  skip: z.number().int().nonnegative().default(0),
});

export const MarkMessageAsReadParamsSchema = z.object({
  messageId: z.string().min(1),
});

// ============================================================================
// User Schemas
// ============================================================================

export const PopulatedUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string().optional(),
});

export const ParticipantSchema = z.object({
  _id: z.string(),
  username: z.string(),
});

// ============================================================================
// Message Schemas
// ============================================================================

export const MessageSchema = z.object({
  _id: z.string(),
  senderId: z.union([z.string(), PopulatedUserSchema]),
  recipientId: z.union([z.string(), PopulatedUserSchema]),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ConversationMessageSchema = z.object({
  _id: z.string(),
  senderId: PopulatedUserSchema,
  recipientId: PopulatedUserSchema,
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Last message is always an object with _id and content
export const LastMessageSchema = z.object({
  _id: z.string(),
  content: z.string(),
}).nullable().optional();

// ============================================================================
// Conversation Schemas
// ============================================================================

export const ConversationSummarySchema = z.object({
  _id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  participants: z.array(ParticipantSchema),
  lastMessage: LastMessageSchema,
  unreadCount: z.number().nonnegative(),
});

export const ConversationsListResponseSchema = z.union([
  z.array(ConversationSummarySchema),
  z.object({
    items: z.array(ConversationSummarySchema),
    total: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
  }),
]);

// ============================================================================
// Response Schemas
// ============================================================================

export const UnreadCountResponseSchema = z.object({
  unreadCount: z.number(),
});

// ============================================================================
// Inferred Types
// ============================================================================

export type GetConversationParams = z.infer<typeof GetConversationParamsSchema>;
export type GetConversationsParams = z.infer<
  typeof GetConversationsParamsSchema
>;
export type MarkMessageAsReadParams = z.infer<
  typeof MarkMessageAsReadParamsSchema
>;
export type PopulatedUser = z.infer<typeof PopulatedUserSchema>;
export type Participant = z.infer<typeof ParticipantSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;
export type LastMessageObject = z.infer<typeof LastMessageSchema>;
export type ConversationSummary = z.infer<typeof ConversationSummarySchema>;
export type ConversationsListResponse = z.infer<
  typeof ConversationsListResponseSchema
>;
export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>;