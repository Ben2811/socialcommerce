"use client";

import { create } from "zustand";
import { Variant } from "../types";

interface ProductDetailsState {
  selectedVariant: Variant | null;
  quantity: number;
  setSelectedVariant: (variant: Variant | null) => void;
  setQuantity: (quantity: number) => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
}

export const useProductDetailsStore = create<ProductDetailsState>((set) => ({
  selectedVariant: null,
  quantity: 1,
  setSelectedVariant: (variant: Variant | null) =>
    set({ selectedVariant: variant, quantity: 1 }),
  setQuantity: (quantity: number) => set({ quantity }),
  increaseQuantity: () => set((state) => ({ quantity: state.quantity + 1 })),
  decreaseQuantity: () =>
    set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),
}));

export const useSelectedVariant = () =>
  useProductDetailsStore((state) => state.selectedVariant);
export const useSelectedQuantity = () =>
  useProductDetailsStore((state) => state.quantity);
export const useSetSelectedVariant = () =>
  useProductDetailsStore((state) => state.setSelectedVariant);
export const useSetQuantity = () =>
  useProductDetailsStore((state) => state.setQuantity);
export const useIncreaseQuantity = () =>
  useProductDetailsStore((state) => state.increaseQuantity);
export const useDecreaseQuantity = () =>
  useProductDetailsStore((state) => state.decreaseQuantity);
