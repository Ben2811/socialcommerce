import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Tiếp tục mua sắm</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Giỏ hàng
          <span className="text-sm font-normal text-gray-500">
            ({itemCount} sản phẩm)
          </span>
        </h1>
      </div>
    </div>
  );
}
