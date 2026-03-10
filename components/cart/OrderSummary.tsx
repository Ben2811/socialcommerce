import { formatPrice } from "@/utils/format";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  total: number;
}

export default function OrderSummary({
  subtotal,
  shippingFee,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Tóm tắt đơn hàng
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-green-600 font-medium">Miễn phí</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-gray-400">
            Miễn phí vận chuyển cho đơn hàng từ {formatPrice(500000)}
          </p>
        )}
        <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-base">
          <span>Tổng cộng</span>
          <span className="text-pink-600 text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <button className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
        Thanh toán
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Thanh toán an toàn & bảo mật</span>
      </div>
    </div>
  );
}
