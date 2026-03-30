"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Send, Image as ImageIcon, Shield, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Mock Data ---
const MOCK_CONVERSATIONS = Array.from({ length: 7 }).map((_, i) => ({
  id: `c${i + 1}`,
  user: {
    id: `u${i + 1}`,
    name: "Chương Tử Luân",
    avatar: "shadcn.png",
  },
  lastMessage: "Xin chào bạn",
  timestamp: "23:03 25/1/2026",
}));

const MOCK_MESSAGES = [
  {
    id: 1,
    content: "Dạ cho mình hỏi sản phẩm này còn màu trắng không shop?",
    sender: "user",
    timestamp: "1:55pm",
  },
  {
    id: 2,
    content: "Chào bạn, sản phẩm màu trắng hiện tại shop vẫn còn hàng nhé. Bạn có thể đặt mua ngay trên hệ thống ạ.",
    sender: "seller",
    timestamp: "2:00pm",
  },
];

export default function SellerSupportPage() {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messagesByConv, setMessagesByConv] = useState<Record<string, typeof MOCK_MESSAGES>>({
    c1: MOCK_MESSAGES,
  });
  const [inputValue, setInputValue] = useState("");

  const currentMessages = activeConversation ? (messagesByConv[activeConversation] || []) : [];

  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      content: inputValue,
      sender: "seller",
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase(),
    };

    setMessagesByConv(prev => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMessage]
    }));
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const activeChatUser = MOCK_CONVERSATIONS.find(c => c.id === activeConversation)?.user || MOCK_CONVERSATIONS[0].user;

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="mb-4 text-sm font-medium text-muted-foreground flex items-center gap-1">
        <span>Seller</span> <span>&gt;</span> <span className={`${!activeConversation ? "text-foreground" : ""}`}>Hỗ trợ</span>
        {activeConversation && (
          <>
            <span>&gt;</span> <span className="text-foreground">{activeChatUser.name}</span>
          </>
        )}
      </div>
      <div className="flex-1 bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden ring-1 ring-border/50">

        {!activeConversation ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-3 p-6">
              {MOCK_CONVERSATIONS.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-card border border-border/50 text-muted-foreground/60 shadow-sm">
                      <Shield className="size-4" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-foreground leading-tight">{conv.user.name}</h3>
                      <p className="text-[14px] text-muted-foreground mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-[13px] text-muted-foreground font-medium">
                    {conv.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (

          <div className="flex flex-col h-full">
            <div className="h-[60px] border-b border-border/50 flex items-center px-4 shrink-0 justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full h-8 w-8"
                  onClick={() => setActiveConversation(null)}
                  aria-label="Quay lại danh sách"
                >
                  <ArrowLeft className="size-5" />
                </Button>
                <Avatar className="size-8 border border-border/50">
                  <AvatarImage src={activeChatUser.avatar} alt={activeChatUser.name} />
                  <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                    {activeChatUser.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-[15px] text-foreground">{activeChatUser.name}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/20">
              {currentMessages.map((msg) => {
                const isSeller = msg.sender === "seller";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSeller ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-5 py-3 ${isSeller
                        ? "bg-blue-600 text-primary-foreground rounded-br-sm shadow-md shadow-blue-500/10"
                        : "bg-background border border-border text-foreground rounded-bl-sm shadow-sm"
                        }`}
                    >
                      <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                      <div
                        className={`text-[11px] mt-1.5 text-right ${isSeller ? "text-primary-foreground/80" : "text-muted-foreground/60"
                          }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-card border-t border-border/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-4 pr-10 h-12 rounded-xl bg-transparent border-input focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all text-[15px] shadow-none"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent h-8 w-8 transition p-1" aria-label="Đính kèm hình ảnh">
                    <ImageIcon className="size-5" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-none gap-2 transition-colors"
                >
                  Gửi
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
