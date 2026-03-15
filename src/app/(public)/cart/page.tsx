"use client";

import { useState } from "react";
import {
  CartItemCard,
  CartHeader,
  OrderSummary,
  EmptyCart,
  type CartItem,
  initialCartItems,
  calculateOrderSummary,
} from "@/features/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const { subtotal, shippingFee, total } = calculateOrderSummary(cartItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader />

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                shippingFee={shippingFee}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
