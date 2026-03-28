"use client";

import { useState } from "react";
import {
  CartItemCard,
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

  const { total } = calculateOrderSummary(cartItems);

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) acc[item.shopName] = [];
    acc[item.shopName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-32 pt-8">
      <div className="max-w-[1040px] mx-auto px-4">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-4">
            {/* Header Row */}
            <div className="bg-white p-4 flex items-center gap-4 text-sm font-semibold text-gray-900 rounded shadow-sm">
              <div className="w-10 flex justify-center">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7F2EE7] focus:ring-[#7F2EE7] cursor-pointer" />
              </div>
              <div className="w-[80px]">Hình ảnh</div>
              <div className="flex-1 min-w-0 pr-4 text-center sm:text-left">Tên sản phẩm</div>
              <div className="w-32">Danh mục</div>
              <div className="w-32">Đơn giá</div>
              <div className="w-32 text-center">Số lượng</div>
              <div className="w-32">Thành tiền</div>
              <div className="w-12"></div>
            </div>

            {/* Shop Groups */}
            {Object.entries(groupedItems).map(([shopName, items]) => (
              <div key={shopName} className="bg-white rounded shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
                  <div className="w-10 flex justify-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7F2EE7] focus:ring-[#7F2EE7] cursor-pointer" />
                  </div>
                  <span className="font-semibold text-gray-900">{shopName}</span>
                </div>
                <div className="flex flex-col">
                  {items.map((item, index) => (
                    <div key={item.id} className={index !== items.length - 1 ? "border-b border-gray-100" : ""}>
                      <CartItemCard
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-[1040px] mx-auto flex flex-wrap items-center justify-end gap-6 sm:gap-8">
            <div className="flex items-center gap-2 text-lg">
              <span className="text-gray-900 font-medium">Tổng cộng ({cartItems.length} sản phẩm):</span>
              <span className="text-[#FF9900] font-bold text-2xl sm:text-3xl">
                {total.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <button className="bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold py-3 px-8 sm:px-12 rounded-lg text-lg transition-colors shadow-sm">
              Đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
