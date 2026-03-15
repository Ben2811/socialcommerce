import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
      <div className="mb-6">
        <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Giỏ hàng của bạn trống
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Hãy khám phá những sản phẩm tuyệt vời và thêm chúng vào giỏ hàng của
        bạn.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
