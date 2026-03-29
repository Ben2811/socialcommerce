import { CartView } from "@/features/cart/components/CartView";
import { initialCartItems } from "@/features/cart";

export default function CartPage() {
  return <CartView initialItems={initialCartItems} />;
}
