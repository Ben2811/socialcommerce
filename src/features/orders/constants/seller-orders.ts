import type { OrderStatus } from "../types/order";

export const SELLER_ORDERS_PAGE_SIZE = 10;

export const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  pending: { label: "Chờ xác nhận", variant: "outline", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  confirmed: { label: "Đã xác nhận", variant: "secondary", color: "text-blue-600 bg-blue-50 border-blue-200" },
  shipped: { label: "Đang giao", variant: "secondary", color: "text-purple-600 bg-purple-50 border-purple-200" },
  delivered: { label: "Đã giao", variant: "default", color: "text-green-600 bg-green-50 border-green-200" },
  cancelled: { label: "Đã hủy", variant: "destructive", color: "text-red-600 bg-red-50 border-red-200" },
};