import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Giỏ hàng trống
      </h2>
      <p className="text-gray-500 mb-6">
        Bạn chưa thêm sản phẩm nào vào giỏ hàng.
      </p>
      <Link
        href="/"
        className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        Khám phá sản phẩm
      </Link>
    </div>
  );
}
