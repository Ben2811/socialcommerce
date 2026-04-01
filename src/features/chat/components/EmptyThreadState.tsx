import { MessageSquareDot } from "lucide-react";

export function EmptyThreadState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MessageSquareDot className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-foreground">Chào mừng đến với Chat</p>
        <p className="text-sm text-muted-foreground">
          Bắt đầu nhắn tin với người bán ngay bây giờ!
        </p>
      </div>
    </div>
  );
}