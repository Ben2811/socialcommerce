"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetail } from "@/features/orders";

interface OrderDetailPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id?.trim();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        {!orderId ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Invalid order id.
          </div>
        ) : (
          <OrderDetail orderId={orderId} />
        )}
      </div>
    </div>
  );
}