import type { CartItem } from '../types/cart';

const FREE_SHIPPING_THRESHOLD = 500000;
const DEFAULT_SHIPPING_FEE = 30000;

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateShippingFee(subtotal: number): number {
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
}

export function calculateTotal(subtotal: number, shippingFee: number): number {
  return subtotal + shippingFee;
}

export function calculateOrderSummary(items: CartItem[]) {
  const subtotal = calculateSubtotal(items);
  const shippingFee = calculateShippingFee(subtotal);
  const total = calculateTotal(subtotal, shippingFee);

  return {
    subtotal,
    shippingFee,
    total,
  };
}
