"use client";
import { useState, useRef, type KeyboardEvent } from "react";
import { SendHorizonal, Paperclip, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-2">
      <Button
        variant="ghost"
        size="icon-sm"
        type="button"
        disabled={disabled}
        aria-label="Attach file"
        className="shrink-0 text-muted-foreground"
      >
        <Paperclip />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        type="button"
        disabled={disabled}
        aria-label="Emoji"
        className="shrink-0 text-muted-foreground"
      >
        <SmilePlus />
      </Button>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
        className="flex-1 border-0 bg-transparent ring-0 focus-visible:ring-0 shadow-none"
        aria-label="Message input"
      />
      <Button
        size="icon-sm"
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="shrink-0"
      >
        <SendHorizonal />
      </Button>
    </div>
  );
}