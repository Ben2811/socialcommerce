import { z } from "zod";

export const ServerEventSchema = z.enum([
  "RECEIVE_MESSAGE",
  "USER_ONLINE",
  "USER_OFFLINE",
  "USER_STATUS",
  "SUCCESS",
  "ERROR",
]);

export type ServerEvent = z.infer<typeof ServerEventSchema>;

export const ClientEventSchema = z.enum([
  "SEND_MESSAGE",
  "CHECK_USER_STATUS",
]);

export type ClientEvent = z.infer<typeof ClientEventSchema>;

export const ServerEvents = ServerEventSchema.enum;
export const ClientEvents = ClientEventSchema.enum;

export interface UserPresence {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  _id: string;
  messageId?: string;
  senderId: string;
  senderUsername?: string;
  recipientId?: string;
  content: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  timestamp: Date;
}

export interface MessageWithSender extends Message {
  senderUsername: string;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

export interface SuccessPayload {
  code: string;
  message: string;
  data: {
    recipientId: string;
    isRecipientOnline: boolean;
  };
}

export const UserOnlinePayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  isOnline: z.literal(true),
});

export const UserOfflinePayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  isOnline: z.literal(false),
  lastSeen: z.coerce.date(),
});

export const ReceiveMessagePayloadSchema = z.object({
  _id: z.string().optional(),
  messageId: z.string().optional(),
  senderId: z.string(),
  recipientId: z.string().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  timestamp: z.coerce.date().optional(),
  senderUsername: z.string().optional(),
});

export const ReceiveMessageWithSenderPayloadSchema = z.object({
  _id: z.string(),
  senderId: z.string(),
  senderUsername: z.string(),
  recipientId: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UserStatusPayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
  isOnline: z.boolean(),
  lastSeen: z.coerce.date().optional(),
});

export const SuccessPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    recipientId: z.string(),
    isRecipientOnline: z.boolean(),
  }),
});

export const ErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const SendMessagePayloadSchema = z.object({
  recipientId: z.string().min(1),
  content: z.string().min(1).max(1000),
});

export type SendMessagePayload = z.infer<typeof SendMessagePayloadSchema>;

export const CheckUserStatusPayloadSchema = z.object({
  userId: z.string().min(1),
});

export type CheckUserStatusPayload = z.infer<typeof CheckUserStatusPayloadSchema>;