// Cart feature exports

export { CartHeader } from "./components/CartHeader";
export { EmptyCart } from "./components/EmptyCart";
export { CartView } from "./components/CartView";
export { CartItemRow } from "./components/CartItemRow";
export { CartTable } from "./components/CartTable";
export { CartCheckoutBar } from "./components/CartCheckoutBar";

export type {
  CartItem,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  CartSummary,
} from "./types/cart";

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