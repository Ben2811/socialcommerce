"use client";

import { Card } from "@/components/ui/card";

export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

interface AdsContentProps {
  ads?: Ad[];
}

const defaultAds: Ad[] = [
  {
    id: "1",
    title: "Mở Shop Miễn Phí - Kiếm Tiền Ngay",
    description: "Tạo cửa hàng online của riêng bạn trong 5 phút. Miễn phí, không giới hạn, không lệ phí ẩn. Bắt đầu kiếm tiền ngay hôm nay!",
    imageUrl: "https://images.pexels.com/photos/7974/pexels-photo.jpg?w=600&h=400&fit=crop",
    link: "/seller/register",
    isActive: true,
  },
  {
    id: "2",
    title: "Flash Sale - Giảm Giá Tới 70%",
    description: "Mỗi ngày 12h trưa và 8h tối. Hàng ngàn sản phẩm hot deal, chỉ có trong 24 giờ. Jangan ketinggalan!",
    imageUrl: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?w=600&h=400&fit=crop",
    link: "/flash-sale",
    isActive: true,
  },
  {
    id: "3",
    title: "Dịch Vụ Logistics An Toàn",
    description: "Vận chuyển nhanh, an toàn. Theo dõi đơn hàng real-time. Bảo hiểm miễn phí lên đến 5 triệu đồng.",
    imageUrl: "https://images.pexels.com/photos/3962571/pexels-photo-3962571.jpeg?w=600&h=400&fit=crop",
    link: "/shipping",
    isActive: true,
  },
  {
    id: "4",
    title: "Thanh Toán Liên Hợp - An Toàn 100%",
    description: "Hỗ trợ 10+ phương thức thanh toán. Bảo vệ người mua & người bán. Xử lý tranh chấp công bằng.",
    imageUrl: "https://images.pexels.com/photos/3823517/pexels-photo-3823517.jpeg?w=600&h=400&fit=crop",
    link: "/payment-methods",
    isActive: true,
  },
  {
    id: "5",
    title: "Affiliate Program - Kiếm Hoa Hồng",
    description: "Chia sẻ link sản phẩm, nhận hoa hồng 5-15% mỗi bán hàng. Không giới hạn thu nhập!",
    imageUrl: "https://images.pexels.com/photos/3874146/pexels-photo-3874146.jpeg?w=600&h=400&fit=crop",
    link: "/affiliate",
    isActive: true,
  },
  {
    id: "6",
    title: "Khuyến Mãi Tháng 4 - Quà Tặng Lớn",
    description: "Mua sắm tháng 4 được rut thưởng voucher, điểm tích lũy và quà tặng độc quyền.",
    imageUrl: "https://images.pexels.com/photos/3962338/pexels-photo-3962338.jpeg?w=600&h=400&fit=crop",
    link: "/april-promo",
    isActive: false,
  },
];

export function AdsContent({ ads = defaultAds }: AdsContentProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ads.map((ad) => (
        <Card key={ad.id} className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">{ad.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  ad.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ad.isActive ? "Hiện" : "Ẩn"}
              </span>
            </div>
          </div>
          {ad.imageUrl && (
            <div className="mb-4 overflow-hidden rounded">
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {!ad.imageUrl && (
            <div className="mb-4 h-40 bg-linear-to-br from-blue-50 to-indigo-50 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm text-gray-500">Không có hình ảnh</p>
              </div>
            </div>
          )}
          <p className="text-gray-700 text-sm mb-3">{ad.description}</p>
          {ad.link && (
            <a href={ad.link} className="text-blue-500 text-sm hover:underline inline-block">
              Xem chi tiết →
            </a>
          )}
        </Card>
      ))}
    </div>
  );
}
