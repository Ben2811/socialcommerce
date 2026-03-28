// Original components (preserved)
export { CartItemCard } from "./components/CartItemCard";
export { CartHeader } from "./components/CartHeader";
export { EmptyCart } from "./components/EmptyCart";
export { default as OrderSummary } from "./components/OrderSummary";

// New components
export { CartView } from "./components/CartView";
export { CartItemRow } from "./components/CartItemRow";
export { CartTable } from "./components/CartTable";
export { CartCheckoutBar } from "./components/CartCheckoutBar";

export type { CartItem, CartGroupByShop } from "./types/cart";

export { initialCartItems, groupCartItemsByShop } from "./constants/mock-data";
export {
  calculateSubtotal,
  calculateShippingFee,
  calculateTotal,
  calculateOrderSummary,
} from "./utils/cartCalculations";
