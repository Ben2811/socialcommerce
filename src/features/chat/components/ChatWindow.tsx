"use client";
import { usePathname } from "next/navigation";
import { MessageSquare, Minus, X } from "lucide-react";
import { useNewMessageNotification } from "../hooks/useNewMessageNotification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/features/shared/utils/cn";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useChatUIStore } from "../stores/chatUIStore";
import { useConversations } from "../hooks/useConversations";
import { useGetUnreadCount } from "../hooks/useMessageAPI";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";

const HIDDEN_ON_PATHS = ["/admin"];

export function ChatWindow() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isOpen, isMinimized, selectedUserId, openChat, closeChat, toggleMinimize } =
    useChatUIStore();

  useNewMessageNotification();

  const conversations = useConversations();
  const { data: unreadCountData } = useGetUnreadCount();
  
  const totalUnread = unreadCountData?.unreadCount ?? conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const isHidden = !user || HIDDEN_ON_PATHS.some((p) => pathname.startsWith(p));
  if (isHidden) return null;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl"
          onClick={() => openChat()}
          aria-label="Mở chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        {totalUnread > 0 && (
          <Badge
            variant="destructive"
            className="pointer-events-none absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1.5 text-[11px]"
          >
            {totalUnread > 99 ? "99+" : totalUnread}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 right-6 z-50 flex flex-col overflow-hidden rounded-t-xl border border-border bg-card shadow-2xl transition-[height] duration-200",
        isMinimized ? "h-12 w-72" : "h-[500px] w-[680px]"
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between bg-primary px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Chat</span>
          {isMinimized && totalUnread > 0 && (
            <Badge className="h-4 min-w-4 rounded-full bg-destructive px-1 text-[10px] text-white">
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={toggleMinimize}
            aria-label={isMinimized ? "Mở rộng" : "Thu nhỏ"}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={closeChat}
            aria-label="Đóng chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex min-h-0 flex-1">
          <ConversationList className="w-60 shrink-0 border-r border-border" />
          <Separator orientation="vertical" />
          <MessageThread
            userId={selectedUserId}
            className="flex flex-1 flex-col min-h-0"
          />
        </div>
      )}
    </div>
  );
}