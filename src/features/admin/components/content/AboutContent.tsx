"use client";

import { Card } from "@/components/ui/card";

interface AboutContentProps {
  content?: {
    title: string;
    description: string;
    shortDescription: string;
  };
}

const defaultContent = {
  title: "SocialCommerce - Nền tảng thương mại xã hội hàng đầu",
  description: `SocialCommerce là nền tảng kết nối những người bán hàng với hàng triệu khách hàng trên toàn quốc. Chúng tôi mang đến giải pháp toàn diện để kinh doanh online dễ dàng, hiệu quả và an toàn.

Với công nghệ tiên tiến, chúng tôi hỗ trợ các nhà bán lẻ phát triển doanh nghiệp của mình thông qua:
• Quản lý sản phẩm và tồn kho tự động
• Hệ thống thanh toán an toàn và đa phương thức
• Công cụ tiếp thị và quảng cáo hiệu quả
• Dịch vụ hỗ trợ khách hàng 24/7
• Logistics tích hợp và giao hàng toàn quốc

Chúng tôi cam kết tạo ra một môi trường thương mại lành mạnh, công bằng và minh bạch cho cả người mua lẫn người bán.`,
  shortDescription: "Kết nối mua - bán trên nền tảng xã hội hiện đại. An toàn, Nhanh, Tiện lợi",
};

export function AboutContent({
  content = defaultContent,
}: AboutContentProps) {
  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="rounded-lg overflow-hidden h-64 bg-linear-to-r from-blue-500 to-indigo-600">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop"
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả ngắn</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {content.shortDescription}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả chi tiết</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {content.description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
