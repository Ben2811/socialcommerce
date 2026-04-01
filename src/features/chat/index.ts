export { SocketProvider, useSocket } from "./providers/SocketProvider";

// Stores
export { useWebSocketStore } from "./stores/chatStore";
export { useChatUIStore } from "./stores/chatUIStore";
export type { ConversationMeta } from "./stores/chatUIStore";

// Hooks
export { useWebSocket } from "./hooks/useWebSocket";
export { useMessages } from "./hooks/useMessages";
export { usePresence } from "./hooks/usePresence";
export { useConversations } from "./hooks/useConversations";
export type { ConversationPreview } from "./hooks/useConversations";
export { useNewMessageNotification } from "./hooks/useNewMessageNotification";
export {
  useGetConversation,
  useGetConversations,
  useMarkMessageAsRead,
  useGetUnreadCount,
} from "./hooks/useMessageAPI";
export { useChatIntegration } from "./hooks/useChatIntegration";

// Components
export { ChatWindow } from "./components/ChatWindow";
export { ChatButton } from "./components/ChatButton";
export { ConversationList } from "./components/ConversationList";
export { ConversationItem } from "./components/ConversationItem";
export { MessageThread } from "./components/MessageThread";
export { MessageBubble } from "./components/MessageBubble";
export { MessageInput } from "./components/MessageInput";
export { EmptyThreadState } from "./components/EmptyThreadState";

// Services
export { messageService } from "./services/message.service";
export type {
  GetConversationParams,
  GetConversationsParams,
  MarkMessageAsReadParams,
  Message,
  PopulatedUser,
  ConversationMessage,
  ConversationSummary,
  ConversationsListResponse,
  UnreadCountResponse,
} from "./services/message.service";

// Types
export type {
  ServerEvent,
  ClientEvent,
  UserPresence,
  ErrorPayload,
  SuccessPayload,
  SendMessagePayload,
  CheckUserStatusPayload,
  MessageWithSender,
} from "./types";
export {
  ServerEvents,
  ClientEvents,
  SendMessagePayloadSchema,
  CheckUserStatusPayloadSchema,
  ReceiveMessagePayloadSchema,
  ReceiveMessageWithSenderPayloadSchema,
  UserOnlinePayloadSchema,
  UserOfflinePayloadSchema,
  UserStatusPayloadSchema,
  ErrorPayloadSchema,
  SuccessPayloadSchema,
} from "./types";