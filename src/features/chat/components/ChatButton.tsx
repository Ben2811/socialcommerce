"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/features/shared/utils/cn";
import { useChatUIStore } from "../stores/chatUIStore";

interface ChatButtonProps {
  sellerId: string;
  sellerName?: string;
  className?: string;
}

export function ChatButton({
  sellerId,
  sellerName = "Người bán",
  className,
}: ChatButtonProps) {
  const { openChat, selectConversation } = useChatUIStore();

  const handleClick = () => {
    openChat(sellerId, sellerName);
    selectConversation(sellerId, sellerName);
  };

  return (
    <Button
      variant="outline"
      className={cn("flex-1", className)}
      onClick={handleClick}
    >
      <MessageCircle />
      Nhắn tin với người bán
    </Button>
  );
}