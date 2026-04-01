"use client";

import { useState, useCallback, useMemo } from "react";
import { CartItem } from "../types/cart";
import { groupCartItemsByShop } from "../constants/mock-data";
import { CartHeader } from "./CartHeader";
import { CartTable } from "./CartTable";
import { CartCheckoutBar } from "./CartCheckoutBar";
import { EmptyCart } from "./EmptyCart";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "../hooks/useCart";
import { cartService } from "../services/cart.service";

function getItemKey(item: CartItem): string {
  return `${item.productId}_${item.sku}`;
}

export function CartView() {
  const { data: cartData, isLoading, isError, error } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const items = useMemo<CartItem[]>(
    () => (cartData?.items ?? []).map((item) => cartService.mapItem(item)),
    [cartData],
  );

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const groups = useMemo(() => groupCartItemsByShop(items), [items]);

  const allItemKeys = useMemo(() => items.map(getItemKey), [items]);

  const allSelected =
    allItemKeys.length > 0 && allItemKeys.every((key) => selectedKeys.has(key));

  const handleToggleSelectShop = useCallback(
    (_shopId: string, allKeys: string[]) => {
      setSelectedKeys((prev) => {
        const shopAllSelected = allKeys.every((key) => prev.has(key));
        const next = new Set(prev);
        if (shopAllSelected) {
          for (const key of allKeys) next.delete(key);
        } else {
          for (const key of allKeys) next.add(key);
        }
        return next;
      });
    },
    [],
  );

  const handleToggleSelectAll = useCallback((allKeys: string[]) => {
    setSelectedKeys((prev) => {
      const isAllSelected = allKeys.every((key) => prev.has(key));
      return isAllSelected ? new Set<string>() : new Set<string>(allKeys);
    });
  }, []);

  const handleUpdateQuantity = useCallback(
    (productId: string, sku: string, delta: number) => {
      const item = items.find(
        (i) => i.productId === productId && i.sku === sku,
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
    // TODO: implement checkout navigation
    alert(`Đặt hàng ${selectedKeys.size} sản phẩm đã chọn`);
  }, [selectedKeys]);

  const { selectedCount, totalAmount } = useMemo(() => {
    const selectedItems = items.filter((item) =>
      selectedKeys.has(getItemKey(item)),
    );
    return {
      selectedCount: selectedItems.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: selectedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      ),
    };
  }, [items, selectedKeys]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Không thể tải giỏ hàng"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-6 py-6">
        <CartHeader />

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col gap-3">
            {/* Cart table */}
            <div className="border border-border rounded-sm bg-card overflow-hidden">
              <CartTable
                groups={groups}
                selectedKeys={selectedKeys}
                allSelected={allSelected}
                allItemKeys={allItemKeys}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectShop={handleToggleSelectShop}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            </div>

            {/* Checkout bar - bottom */}
            <CartCheckoutBar
              selectedCount={selectedCount}
              totalAmount={totalAmount}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </div>
  );
}
