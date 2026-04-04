"use client";

import Link from "next/link";
import { UserMenu } from "./UserMenu";

export function TopBar() {
  return (
    <div className="border-b border-border/40 bg-muted/40 py-2 text-[13px] text-muted-foreground">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link
            href="#"
            className="transition-colors hover:text-primary"
          >
            Tải ứng dụng
          </Link>
          <div className="h-3 w-[1px] bg-border" />
          <Link
            href="/seller/products"
            className="transition-colors hover:text-primary"
          >
            Kênh buôn bán
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            href="#"
            className="transition-colors hover:text-primary"
          >
            Hỗ trợ
          </Link>
          <div className="h-3 w-[1px] bg-border" />
          <UserMenu />
        </div>
      </div>
    </div>
  );
}