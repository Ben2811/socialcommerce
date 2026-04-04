"use client";

import { AdsHeader, AdsContent } from "@/features/admin/components/content";

export default function AdsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,237,0.88)_0%,rgba(255,255,255,1)_22%,rgba(247,248,252,1)_100%)] text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <AdsHeader />
        <AdsContent />
      </div>
    </main>
  );
}
