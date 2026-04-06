"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Truck, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/features/shared/utils/cn";
import { useCreateVnpayPayment } from "@/features/payments/hooks/usePayments";
import { useConfirmCodOrder } from "@/features/orders/hooks/useOrders";

type StepStatus = "done" | "current" | "todo";
type PaymentMethodId = "vnpay" | "cod";

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
    icon: WalletCards,
  },
  {
    id: "cod" as const,
    label: "Thanh toán khi nhận hàng (COD)",
    description:
      "Nhận hàng và thanh toán bằng tiền mặt khi shipper giao đến tay bạn",
    icon: Truck,
  },
];

export function PaymentView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("vnpay");

  const { mutate: createVnpayPayment, isPending: isCreatingVnpay } =
    useCreateVnpayPayment();
  const { mutate: confirmCod, isPending: isConfirmingCod } =
    useConfirmCodOrder();

  const isPending = isCreatingVnpay || isConfirmingCod;

  useEffect(() => {
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng. Vui lòng quay lại giỏ hàng.");
      router.replace("/cart");
    }
  }, [orderId, router]);

  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handlePayment = () => {
    if (selectedMethod === "vnpay") {
      createVnpayPayment({ orderId, language: "vn" });
    } else {
      confirmCod(orderId, {
        onSuccess: () => {
          router.push(`/payment/result/cod?orderId=${orderId}`);
        },
      });
    }
  };

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
                    isCurrent && "border border-primary bg-primary text-primary-foreground",
                    isDone && "border border-primary bg-primary text-primary-foreground",
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                  const Icon = method.icon;

                  return (
                    <label
                      key={method.id}
                      htmlFor={`payment-method-${method.id}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-3xl border p-4 transition-colors md:px-6",
                        isSelected
                          ? "border-2 border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-muted/30",
                      )}
                    >
                      <RadioGroupItem
                        id={`payment-method-${method.id}`}
                        value={method.id}
                        className="mt-3"
                      />

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
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
            id="payment-continue-btn"
            type="button"
            variant="default"
            size="lg"
            disabled={isPending}
            onClick={handlePayment}
            className="h-10 w-full rounded-lg text-sm font-semibold"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCreatingVnpay ? "Đang tạo thanh toán..." : "Đang xác nhận..."}
              </>
            ) : (
              "Tiếp tục thanh toán"
            )}
          </Button>
        </div>
      </section>
    </main>
  );
}
