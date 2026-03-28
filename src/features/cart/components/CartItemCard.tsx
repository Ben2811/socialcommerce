"use client";

import Image from "next/image";
import { Minus, Plus, MoreHorizontal } from "lucide-react";
import { CartItem } from "../types/cart";
import { formatPrice } from "@/features/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
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
    <div className="bg-white p-4 flex items-center gap-4 text-sm hover:shadow-sm transition-shadow">
      {/* Checkbox */}
      <div className="w-10 flex justify-center">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
        />
      </div>

      {/* Hình ảnh */}
      <div className="w-[80px] h-[80px] relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Tên sản phẩm */}
      <div className="flex-1 min-w-0 pr-4">
        <h3 className="font-medium text-gray-900 truncate" title={item.name}>
          {item.name}
        </h3>
      </div>

      {/* Danh mục */}
      <div className="w-32 text-gray-500 truncate" title={item.category}>
        {item.category}
      </div>

      {/* Đơn giá */}
      <div className="w-32 text-gray-700">
        {item.price.toLocaleString("vi-VN")}
      </div>

      {/* Số lượng */}
      <div className="w-32 flex items-center">
        <div className="flex items-center border border-gray-200 rounded">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-10 text-center text-gray-900 font-medium border-x border-gray-200 h-8 flex items-center justify-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Thành tiền */}
      <div className="w-32">
        <span className="bg-[#E8F8EE] text-[#00A251] px-2 py-1 rounded text-sm font-semibold">
          {(item.price * item.quantity).toLocaleString("vi-VN")} đ
        </span>
      </div>

      {/* Actions */}
      <div className="w-12 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center justify-center h-8 w-8 rounded-full focus:outline-none focus:bg-gray-100 cursor-pointer"
            aria-label="Tùy chọn"
          >
            <MoreHorizontal className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => onRemove(item.id)}
              variant="destructive"
            >
              Xóa sản phẩm
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
