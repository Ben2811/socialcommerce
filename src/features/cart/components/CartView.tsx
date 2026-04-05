"use client";

import { useCallback, useMemo, useState } from "react";
import { CartHeader } from "./CartHeader";
import { CartTable } from "./CartTable";
import { CartCheckoutBar } from "./CartCheckoutBar";
import { EmptyCart } from "./EmptyCart";
import { CheckoutDialog } from "./CheckoutDialog";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "../hooks/useCart";
import type { CartItem } from "../types/cart";

function getItemKey(item: CartItem): string {
  return `${item.productId}_${item.sku}`;
}

export function CartView() {
  const query = useCart();
  const items = useMemo(() => query.data ?? [], [query.data]);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const allItemKeys = useMemo(() => items.map(getItemKey), [items]);

  const allSelected =
    allItemKeys.length > 0 && allItemKeys.every((key) => selectedKeys.has(key));

  const selectedItems = useMemo(
    () => items.filter((item) => selectedKeys.has(getItemKey(item))),
    [items, selectedKeys],
  );

  const handleToggleSelectAll = useCallback((allKeys: string[]) => {
    setSelectedKeys((prev) => {
      const isAllSelected = allKeys.every((key) => prev.has(key));
      return isAllSelected ? new Set<string>() : new Set<string>(allKeys);
    });
  }, []);

  const handleToggleSelectItem = useCallback(
    (productId: string, sku: string) => {
      const key = `${productId}_${sku}`;
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [],
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, sku: string, delta: number) => {
      const item = items.find(
        (current) => current.productId === productId && current.sku === sku,
      );
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);
      if (newQuantity === item.quantity) return;

      updateCartItem.mutate({ productId, sku, quantity: newQuantity });
    },
    [items, updateCartItem],
  );

  const handleRemove = useCallback(
    (productId: string, sku: string) => {
      removeFromCart.mutate({ productId, sku });
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        next.delete(`${productId}_${sku}`);
        return next;
      });
    },
    [removeFromCart],
  );

  const handleCheckout = useCallback(() => {
    setIsCheckoutOpen(true);
  }, []);

  const handleCheckoutSuccess = useCallback(() => {
    setSelectedKeys(new Set());
    setIsCheckoutOpen(false);
  }, []);

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems],
  );

  const totalAmount = useMemo(
    () =>
      selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems],
  );

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          <CartHeader />
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            Đang tải giỏ hàng...
          </div>
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          <CartHeader />
          <div className="flex items-center justify-center py-10 text-destructive">
            {query.error instanceof Error
              ? query.error.message
              : "Không thể tải giỏ hàng"}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          <CartHeader />
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <CartHeader />

        <div className="flex flex-col gap-3">
          <div className="border border-border rounded-sm bg-card overflow-hidden">
            <CartTable
              items={items}
              selectedKeys={selectedKeys}
              allSelected={allSelected}
              allItemKeys={allItemKeys}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectItem={handleToggleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
            />
          </div>

          <CartCheckoutBar
            selectedCount={selectedCount}
            totalAmount={totalAmount}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <CheckoutDialog
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
        selectedItems={selectedItems}
      />
    </div>
  );
}