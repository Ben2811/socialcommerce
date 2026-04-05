"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/features/shared/utils/cn";
import { useChatUIStore } from "../stores/chatUIStore";
import { useAuth } from "@/features/auth/providers/AuthProvider";

interface ChatButtonProps {
  sellerId: string;
  sellerName?: string;
  label?: string;
  className?: string;
}

export function ChatButton({
  sellerId,
  sellerName = "Người bán",
  label = "Nhắn tin với người bán",
  className,
}: ChatButtonProps) {
  const { openChat, selectConversation } = useChatUIStore();
  const { user } = useAuth();

  const isOwnShop = user?._id === sellerId;

  const handleClick = () => {
    if (isOwnShop) return;
    openChat(sellerId, sellerName);
    selectConversation(sellerId, sellerName);
  };

  return (
    <Button
      variant="outline"
      className={cn("flex-1", className)}
      onClick={handleClick}
      disabled={isOwnShop}
      title={isOwnShop ? "Bạn không thể nhắn tin với chính mình" : ""}
    >
      <MessageCircle />
      {label}
    </Button>
  );
}
