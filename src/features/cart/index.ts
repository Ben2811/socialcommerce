export { CartItemCard } from "./components/CartItemCard";
export { CartHeader } from "./components/CartHeader";
export { EmptyCart } from "./components/EmptyCart";
export { default as OrderSummary } from "./components/OrderSummary";

export type { CartItem } from "./types/cart";

export { initialCartItems } from "./constants/mock-data";
export {
  calculateSubtotal,
  calculateShippingFee,
  calculateTotal,
  calculateOrderSummary,
} from "./utils/cartCalculations";
