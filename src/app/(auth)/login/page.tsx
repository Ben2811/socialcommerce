"use client";

import { AuthHero } from "@/features/auth/components/AuthHero";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30 px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:flex">
          <AuthHero
            badgeLabel="Chào mừng trở lại"
            title="Đăng nhập để tiếp tục hành trình mua sắm của bạn."
            description="Truy cập giỏ hàng của bạn, quản lý đơn hàng, lưu yêu thích và giữ hồ sơ của bạn đồng bộ trên các thiết bị."
          />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
