"use client";

import { useState, useCallback, useMemo } from "react";
import { CartItem } from "../types/cart";
import { groupCartItemsByShop } from "../constants/mock-data";
import { CartHeader } from "./CartHeader";
import { CartTable } from "./CartTable";
import { CartCheckoutBar } from "./CartCheckoutBar";
import { EmptyCart } from "./EmptyCart";

interface CartViewProps {
  initialItems: CartItem[];
}

export function CartView({ initialItems }: CartViewProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const groups = useMemo(() => groupCartItemsByShop(items), [items]);

  const allItemIds = useMemo(() => items.map((i) => i.id), [items]);

  const allSelected =
    allItemIds.length > 0 && allItemIds.every((id) => selectedIds.has(id));

  const handleToggleSelectItem = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleSelectShop = useCallback(
    (_shopId: number, allIds: number[]) => {
      setSelectedIds((prev) => {
        const shopAllSelected = allIds.every((id) => prev.has(id));
        const next = new Set(prev);
        if (shopAllSelected) {
          for (const id of allIds) next.delete(id);
        } else {
          for (const id of allIds) next.add(id);
        }
        return next;
      });
    },
    []
  );

  const handleToggleSelectAll = useCallback((allIds: number[]) => {
    setSelectedIds((prev) => {
      const isAllSelected = allIds.every((id) => prev.has(id));
      return isAllSelected ? new Set<number>() : new Set<number>(allIds);
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  const handleRemove = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleCheckout = useCallback(() => {
    // TODO: implement checkout navigation
    alert(`Đặt hàng ${selectedIds.size} sản phẩm đã chọn`);
  }, [selectedIds]);

  const { selectedCount, totalAmount } = useMemo(() => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    return {
      selectedCount: selectedItems.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: selectedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ),
    };
  }, [items, selectedIds]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-6">
        <CartHeader />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col gap-3">
            {/* Checkout bar */}
            <CartCheckoutBar
              selectedCount={selectedCount}
              totalAmount={totalAmount}
              totalItems={items.length}
              allSelected={allSelected}
              allItemIds={allItemIds}
              onToggleSelectAll={handleToggleSelectAll}
              onCheckout={handleCheckout}
            />

            {/* Cart table */}
            <div className="border border-border rounded-sm bg-card overflow-hidden">
              <CartTable
                groups={groups}
                selectedIds={selectedIds}
                onToggleSelectItem={handleToggleSelectItem}
                onToggleSelectShop={handleToggleSelectShop}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
