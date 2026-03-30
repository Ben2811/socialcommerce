import { Receipt } from "lucide-react";

export default function SellerBillsPage() {
  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="mb-4 text-sm font-medium text-muted-foreground">
        <span>Seller</span> <span className="mx-1">&gt;</span> <span className="text-foreground">Hóa đơn</span>
      </div>
      <div className="flex-1 bg-card rounded-xl shadow-sm border border-border/50 flex flex-col items-center justify-center text-muted-foreground/60">
        <Receipt className="size-16 mb-4 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground/80">Hóa đơn</h2>
        <p className="mt-2 text-sm text-center max-w-sm">
          Tính năng đang được phát triển.
        </p>
      </div>
    </div>
  );
}
