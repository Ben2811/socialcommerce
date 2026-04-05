import { create } from "zustand";
import type { Socket } from "socket.io-client";
import type { Message, UserPresence, ErrorPayload } from "../types";

interface WebSocketState {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;

  currentUser: UserPresence | null;
  onlineUsers: Map<string, UserPresence>;

  messages: Map<string, Message[]>;
  messageLoading: string | null;
  messageError: ErrorPayload | null;

  userStatuses: Map<string, UserPresence>;
  statusLoading: string | null;

  setSocket: (socket: Socket | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setConnectionError: (error: string | null) => void;

  setCurrentUser: (user: UserPresence | null) => void;
  addOnlineUser: (user: UserPresence) => void;
  removeOnlineUser: (userId: string) => void;

  addMessage: (senderId: string, message: Message) => void;
  getConversation: (userId: string) => Message[];
  setMessageLoading: (userId: string | null) => void;
  setMessageError: (error: ErrorPayload | null) => void;
  clearMessages: () => void;

  setUserStatus: (userId: string, status: UserPresence) => void;
  setStatusLoading: (userId: string | null) => void;

  reset: () => void;
}

const initialState = {
  socket: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  currentUser: null,
  onlineUsers: new Map<string, UserPresence>(),
  messages: new Map<string, Message[]>(),
  messageLoading: null,
  messageError: null,
  userStatuses: new Map<string, UserPresence>(),
  statusLoading: null,
};

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  ...initialState,

  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ isConnected: connected }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  setConnectionError: (error) => set({ connectionError: error }),

  setCurrentUser: (user) => set({ currentUser: user }),

  addOnlineUser: (user) => {
    const updated = new Map(get().onlineUsers);
    updated.set(user.userId, user);
    set({ onlineUsers: updated });
  },

  removeOnlineUser: (userId) => {
    const updated = new Map(get().onlineUsers);
    updated.delete(userId);
    set({ onlineUsers: updated });
  },

  addMessage: (senderId, message) => {
    const updated = new Map(get().messages);
    const conversation = [...(updated.get(senderId) ?? []), message];
    updated.set(senderId, conversation);
    set({ messages: updated });
  },

  getConversation: (userId) => get().messages.get(userId) ?? [],

  setMessageLoading: (userId) => set({ messageLoading: userId }),
  setMessageError: (error) => set({ messageError: error }),
  clearMessages: () => set({ messages: new Map() }),

  setUserStatus: (userId, status) => {
    const updated = new Map(get().userStatuses);
    updated.set(userId, status);
    set({ userStatuses: updated });
  },

  setStatusLoading: (userId) => set({ statusLoading: userId }),

  reset: () => set({ ...initialState }),
}));