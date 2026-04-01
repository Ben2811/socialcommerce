import { create } from "zustand";

export interface ConversationMeta {
  userId: string;
  username: string;
}

interface ChatUIState {
  isOpen: boolean;
  isMinimized: boolean;
  selectedUserId: string | null;
  openedConversations: Map<string, ConversationMeta>;
  readTimestamps: Map<string, Date>;

  openChat: (userId?: string, username?: string) => void;
  closeChat: () => void;
  toggleMinimize: () => void;
  selectConversation: (userId: string, username?: string) => void;
  markAsRead: (userId: string) => void;
}

export const useChatUIStore = create<ChatUIState>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  selectedUserId: null,
  openedConversations: new Map(),
  readTimestamps: new Map(),

  openChat: (userId, username) => {
    const { openedConversations, readTimestamps } = get();
    const updatedConversations = new Map(openedConversations);
    const updatedReadTimestamps = new Map(readTimestamps);

    if (userId) {
      updatedConversations.set(userId, {
        userId,
        username: username ?? updatedConversations.get(userId)?.username ?? "Người bán",
      });
      updatedReadTimestamps.set(userId, new Date());
    }

    set({
      isOpen: true,
      isMinimized: false,
      selectedUserId: userId ?? get().selectedUserId,
      openedConversations: updatedConversations,
      readTimestamps: updatedReadTimestamps,
    });
  },

  closeChat: () => set({ isOpen: false }),

  toggleMinimize: () =>
    set((state) => ({ isMinimized: !state.isMinimized })),

  selectConversation: (userId, username) => {
    const { openedConversations, readTimestamps } = get();
    const updatedConversations = new Map(openedConversations);

    updatedConversations.set(userId, {
      userId,
      username: username ?? updatedConversations.get(userId)?.username ?? "Người bán",
    });

    const updatedReadTimestamps = new Map(readTimestamps);
    updatedReadTimestamps.set(userId, new Date());

    set({
      selectedUserId: userId,
      isMinimized: false,
      openedConversations: updatedConversations,
      readTimestamps: updatedReadTimestamps,
    });
  },

  markAsRead: (userId) => {
    const updated = new Map(get().readTimestamps);
    updated.set(userId, new Date());
    set({ readTimestamps: updated });
  },
}));