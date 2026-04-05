"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VnpayReturnParams } from "@/features/payments";

function parseVnpayParams(searchParams: URLSearchParams): VnpayReturnParams {
  return {
    vnp_ResponseCode: searchParams.get("vnp_ResponseCode") ?? undefined,
    vnp_TransactionStatus:
      searchParams.get("vnp_TransactionStatus") ?? undefined,
    vnp_TxnRef: searchParams.get("vnp_TxnRef") ?? undefined,
    vnp_Amount: searchParams.get("vnp_Amount") ?? undefined,
    vnp_TransactionNo: searchParams.get("vnp_TransactionNo") ?? undefined,
    vnp_PayDate: searchParams.get("vnp_PayDate") ?? undefined,
    vnp_OrderInfo: searchParams.get("vnp_OrderInfo") ?? undefined,
    vnp_BankCode: searchParams.get("vnp_BankCode") ?? undefined,
  };
}

function formatAmount(raw?: string): string {
  if (!raw) return "--";
  const amount = Number(raw) / 100;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatPayDate(raw?: string): string {
  if (!raw || raw.length !== 14) return raw ?? "--";
  // yyyyMMddHHmmss
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  const hour = raw.slice(8, 10);
  const min = raw.slice(10, 12);
  const sec = raw.slice(12, 14);
  return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
}

function extractOrderId(txnRef?: string): string {
  if (!txnRef) return "--";
  return txnRef.split("_")[0] ?? txnRef;
}

export function VnpayResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = parseVnpayParams(searchParams);

  const isSuccess =
    params.vnp_ResponseCode === "00" &&
    params.vnp_TransactionStatus === "00";

  const orderId = extractOrderId(params.vnp_TxnRef);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        {/* Status icon */}
        <div className="mb-6 flex justify-center">
          {isSuccess ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 text-destructive" />
          )}
        </div>

        {/* Title */}
        <h1 className="mb-2 text-center text-2xl font-bold">
          {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          {isSuccess
            ? "Đơn hàng của bạn đã được xác nhận và đang được xử lý."
            : "Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."}
        </p>

        {/* Transaction details */}
        <div className="mb-8 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
          <DetailRow label="Mã đơn hàng" value={orderId} />
          {params.vnp_TransactionNo && (
            <DetailRow
              label="Mã giao dịch VNPay"
              value={params.vnp_TransactionNo}
            />
          )}
          {params.vnp_Amount && (
            <DetailRow label="Số tiền" value={formatAmount(params.vnp_Amount)} />
          )}
          {params.vnp_BankCode && (
            <DetailRow label="Ngân hàng" value={params.vnp_BankCode} />
          )}
          {params.vnp_PayDate && (
            <DetailRow
              label="Thời gian thanh toán"
              value={formatPayDate(params.vnp_PayDate)}
            />
          )}
          <DetailRow
            label="Trạng thái"
            value={
              <span
                className={
                  isSuccess ? "text-green-600 font-medium" : "text-destructive font-medium"
                }
              >
                {isSuccess ? "Thành công" : `Thất bại (${params.vnp_ResponseCode ?? "unknown"})`}
              </span>
            }
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push(`/orders/${orderId}`)}>
            <Clock className="mr-2 h-4 w-4" />
            Xem chi tiết đơn hàng
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
