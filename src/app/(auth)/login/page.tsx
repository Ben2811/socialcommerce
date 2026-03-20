"use client";

import { AuthHero } from "@/features/auth/components/AuthHero";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30 px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:flex">
          <AuthHero
            badgeLabel="Welcome back"
            title="Sign in to continue your shopping journey."
            description="Access your cart, manage orders, save favorites, and keep your profile in sync across devices."
          />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}