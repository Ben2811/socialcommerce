// Original components (preserved)
export { CartItemCard } from "./components/CartItemCard";
export { CartHeader } from "./components/CartHeader";
export { EmptyCart } from "./components/EmptyCart";

// New components
export { CartView } from "./components/CartView";
export { CartItemRow } from "./components/CartItemRow";
export { CartTable } from "./components/CartTable";
export { CartCheckoutBar } from "./components/CartCheckoutBar";

export type {
  CartItem,
  CartGroupByShop,
  CartApiItem,
  CartApiResponse,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  CartSummary,
} from "./types/cart";

export { initialCartItems, groupCartItemsByShop } from "./constants/mock-data";
export {
  calculateSubtotal,
  calculateShippingFee,
  calculateTotal,
  calculateOrderSummary,
} from "./utils/cartCalculations";

export {
  cartService,
  CartService,
} from "./services/cart.service";

export {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
  cartQueryKeys,
} from "./hooks/useCart";