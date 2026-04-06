"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-background to-muted/30 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon Section */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/10 rounded-full blur-2xl" />
            <div className="relative bg-destructive/20 rounded-full p-6 flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Không tìm thấy trang
            </h2>
            <p className="text-base text-muted-foreground">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full" size="lg">
              <Home className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang trước
          </Button>
        </div>

        {/* Additional Links */}
        <div className="pt-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-4">
            Hoặc khám phá các liên kết khác:
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/categories"
              className="text-sm text-primary hover:underline"
            >
              Khám phá sản phẩm
            </Link>
            <Link
              href="/profile"
              className="text-sm text-primary hover:underline"
            >
              Tài khoản của tôi
            </Link>
            <a
              href="mailto:support@socialcommerce.com"
              className="text-sm text-primary hover:underline"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
