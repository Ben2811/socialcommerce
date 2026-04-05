"use client";

import { AuthHero } from "@/features/auth/components/AuthHero";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30 px-4 py-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:flex">
          <AuthHero
            badgeLabel="Join Social Commerce"
            title="Create your account and start shopping smarter."
            description="Save products, track orders, and connect with sellers in one clean shopping experience."
          />
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}