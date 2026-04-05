"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/features/shared/utils/cn";

type StepStatus = "done" | "current" | "todo";
type PaymentMethodId = "vnpay";

interface CheckoutStep {
  id: number;
  label: string;
  status: StepStatus;
}

const CHECKOUT_STEPS: CheckoutStep[] = [
  { id: 1, label: "Chọn giỏ hàng", status: "done" },
  { id: 2, label: "Thông tin đặt hàng", status: "done" },
  { id: 3, label: "Thanh toán", status: "current" },
  { id: 4, label: "Đặt thành công", status: "todo" },
];

const PAYMENT_METHODS = [
  {
    id: "vnpay" as const,
    label: "VNPay",
    description:
      "Thanh toán qua VNPay - Hỗ trợ thẻ ATM, Visa, Mastercard, QR Code",
  },
];

export function PaymentView() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("vnpay");

  return (
    <main className="bg-background">
      <section className="mx-auto w-full max-w-4xl px-4 py-8 md:py-10">
        <ol className="mb-5 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:gap-x-10">
          {CHECKOUT_STEPS.map((step) => {
            const isCurrent = step.status === "current";
            const isDone = step.status === "done";

            return (
              <li key={step.id} className="flex flex-col items-center gap-2 text-center">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border text-lg font-semibold leading-5 transition-colors",
                    isCurrent && "border border-foreground/70 bg-orange-400 text-foreground",
                    isDone && "border border-foreground/70 bg-orange-400 text-foreground",
                    !isCurrent && !isDone && "border-border bg-card text-muted-foreground",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {step.id}
                </div>

                <p
                  className={cn(
                    "text-sm leading-5 md:text-base",
                    isCurrent || isDone ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mb-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </div>

        <div className="space-y-3">
          <div className="rounded-3xl border border-border bg-card p-5 md:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 text-orange-500">
                <WalletCards className="h-5 w-5" />
              </div>

              <h1 className="text-xl font-normal leading-5 text-foreground md:text-2xl">
                Chọn phương thức thanh toán
              </h1>
            </div>

            <div className="space-y-8">
              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => setSelectedMethod(value as PaymentMethodId)}
                className="gap-4"
              >
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedMethod === method.id;

                  return (
                    <label
                      key={method.id}
                      htmlFor={`payment-method-${method.id}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-3xl border p-4 transition-colors md:px-6",
                        isSelected
                          ? "border-2 border-orange-500 bg-orange-100/70"
                          : "border-border bg-card hover:bg-muted/30",
                      )}
                    >
                      <RadioGroupItem
                        id={`payment-method-${method.id}`}
                        value={method.id}
                        className="mt-3"
                      />

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-200 text-orange-500">
                        <WalletCards className="h-6 w-6" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-lg font-bold leading-6 text-foreground md:text-xl">
                          {method.label}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground md:text-base">
                          {method.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>

              <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
                <p className="text-sm leading-6 text-foreground/80 md:text-base">
                  Tất cả các phương thức thanh toán đều được bảo mật bằng mã
                  hóa theo tiêu chuẩn ngành. Thông tin thanh toán của bạn không
                  bao giờ được lưu trữ trên máy chủ của chúng tôi.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="orange"
            size="lg"
            className="h-10 w-full rounded-lg bg-orange-400 text-white hover:bg-orange-500 text-sm font-semibold"
          >
            Tiếp tục thanh toán
          </Button>
        </div>
      </section>
    </main>
  );
}
