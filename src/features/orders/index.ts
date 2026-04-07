// Orders feature exports

export { OrderListItem } from "./components/OrderListItem";
export { OrdersList } from "./components/OrdersList";
export { OrderDetail } from "./components/OrderDetail";
export { SellerOrderCard } from "./components/SellerOrderCard";
export { SellerOrdersGrid } from "./components/SellerOrdersGrid";
export { SellerOrdersTable } from "./components/SellerOrdersTable";

export type {
  Order,
  OrderStatus,
  OrderItem,
  OrderUser,
  ShippingAddress,
  CreateOrderInput,
  UpdateOrderInput,
  OrdersListResponse,
} from "./types/order";

export { orderService, OrderService } from "./services/order.service";

export {
  useOrders,
  useMyOrders,
  useSellerOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrder,
  useCancelOrder,
  useConfirmCodOrder,
  useDeleteOrder,
  orderQueryKeys,
  sellerOrderQueryKeys,
} from "./hooks/useOrders";

export { SELLER_ORDERS_PAGE_SIZE, statusConfig } from "./constants/seller-orders";

export { formatCreatedAt } from "./utils/formatting";