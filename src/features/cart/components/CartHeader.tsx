import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function CartHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
    </div>
  );
}
