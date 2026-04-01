"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "../types/cart";
import { formatPrice } from "@/features/shared";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, sku: string, delta: number) => void;
  onRemove: (productId: string, sku: string) => void;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 flex gap-4 sm:gap-6 hover:shadow-md transition-shadow">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
            {item.name}
          </h3>
          <p className="text-pink-600 font-bold text-lg mt-1">
            {formatPrice(item.price)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.sku, -1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Decrease quantity for ${item.name}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="w-8 text-center font-semibold text-gray-900"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.sku, 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-600"
              aria-label={`Increase quantity for ${item.name}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-900 hidden sm:block">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              onClick={() => onRemove(item.productId, item.sku)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
