"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/features/shared/utils/cn";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useChatIntegration } from "../hooks/useChatIntegration";
import { useConversationInfinite } from "../hooks/useConversationInfinite";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useMergedMessages } from "../hooks/useMergedMessages";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { useMarkMessagesAsRead } from "../hooks/useMarkMessagesAsRead";
import { useWebSocketStore } from "../stores/chatStore";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { EmptyThreadState } from "./EmptyThreadState";
import { Loader2, AlertCircle, ChevronUp } from "lucide-react";
import type { ConversationMessage } from "../services/schemas";

interface MessageThreadProps {
  userId: string | null;
  className?: string;
}

function MessageLoadingState() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

function MessageErrorState({ error }: { error: { message?: string } | null }) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error?.message || "Failed to load messages"}</span>
      </div>
    </div>
  );
}

function EmptyConversationState() {
  return (
    <div className="flex h-full items-center justify-center py-8">
      <p className="text-xs text-muted-foreground">
        Hãy bắt đầu cuộc trò chuyện!
      </p>
    </div>
  );
}

function FetchingIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      <span className="text-xs text-muted-foreground">
        Đang tải tin nhắn cũ hơn...
      </span>
    </div>
  );
}

interface MessageListProps {
  messages: ConversationMessage[];
  currentUserId: string | undefined;
  isFetching: boolean;
  hasNextPage: boolean;
  onFetchNext: () => void;
  bottomRef: React.MutableRefObject<HTMLDivElement | null>;
}

function MessageList({
  messages,
  currentUserId,
  isFetching,
  hasNextPage,
  onFetchNext,
  bottomRef,
}: MessageListProps) {
  return (
    <div className="flex flex-col gap-2">
      {isFetching && <FetchingIndicator />}

      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isSentByMe={msg.senderId._id === currentUserId}
        />
      ))}

      {hasNextPage && !isFetching && (
        <button
          onClick={onFetchNext}
          className="mx-auto my-2 flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/80"
        >
          <ChevronUp className="h-3 w-3" />
          Tải thêm tin nhắn cũ hơn
        </button>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export function MessageThread({ userId, className }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { messageError, messages: realtimeMessages } = useWebSocketStore();

  const { targetUserId, sendMessage, markAsRead } = useChatIntegration({
    otherUserId: userId ?? undefined,
    autoMarkAsRead: false,
  });

  const { messages, fetchNextPage, hasNextPage, isFetching, isLoading, error } =
    useConversationInfinite({
      otherUserId: targetUserId,
      enabled: !!targetUserId,
    });

  const mergedMessages = useMergedMessages(
    messages,
    realtimeMessages,
    targetUserId,
    user?._id,
    user?.username,
  );

  const bottomRef = useAutoScroll(mergedMessages);
  useMarkMessagesAsRead(mergedMessages, user?._id, markAsRead);

  const isAtTop = useScrollToTop(scrollRef, {
    threshold: 100,
    enabled: !!targetUserId && !isFetching && !!hasNextPage,
  });

  useEffect(() => {
    if (isAtTop && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [isAtTop, hasNextPage, isFetching, fetchNextPage]);

  if (!userId) {
    return (
      <div className={cn("flex flex-col", className)}>
        <EmptyThreadState />
      </div>
    );
  }

  const canChat = !!targetUserId && !!user;
  const hasError = error || messageError;
  const isEmpty = mergedMessages.length === 0;

  return (
    <div className={cn("flex flex-col", className)}>
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3 overflow-y-auto">
        {isLoading && isEmpty ? (
          <MessageLoadingState />
        ) : hasError && isEmpty ? (
          <MessageErrorState error={error} />
        ) : isEmpty ? (
          <EmptyConversationState />
        ) : (
          <MessageList
            messages={mergedMessages}
            currentUserId={user?._id}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            onFetchNext={fetchNextPage}
            bottomRef={bottomRef}
          />
        )}
      </ScrollArea>

      <Separator />
      <MessageInput onSend={sendMessage} disabled={!canChat} />
    </div>
  );
}
