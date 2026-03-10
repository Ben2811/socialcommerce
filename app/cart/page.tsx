"use client";

import { useState } from "react";
import { CartItem } from "@/utils/cart";
import { initialCartItems } from "@/constants/mock-data";
import CartHeader from "../../components/cart/CartHeader";
import EmptyCart from "../../components/cart/EmptyCart";
import CartItemCard from "../../components/cart/CartItemCard";
import OrderSummary from "../../components/cart/OrderSummary";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <CartHeader itemCount={cartItems.length} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
