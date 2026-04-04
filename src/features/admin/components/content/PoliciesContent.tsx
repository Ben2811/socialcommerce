"use client";

import { Card } from "@/components/ui/card";
import { Lock, FileText, CreditCard, RefreshCw } from "lucide-react";

export interface Policy {
  id: string;
  title: string;
  content: string;
}

interface PoliciesContentProps {
  policies?: Policy[];
}

const defaultPolicies: Policy[] = [
  {
    id: "1",
    title: "Chính sách bảo mật thông tin",
    content: `1. THÔNG TIN WE COLLECT
Chúng tôi thu thập các thông tin sau để cung cấp dịch vụ:
- Thông tin cá nhân: Tên, email, số điện thoại, địa chỉ
- Thông tin tài khoản: Tên đăng nhập, mật khẩu (mã hóa)
- Thông tin giao dịch: Lịch sử mua/bán, phương thức thanh toán
- Thông tin kỹ thuật: IP address, loại trình duyệt, cookies

2. CÁCH CHÚNG TÔI SỬ DỤNG THÔNG TIN
- Cung cấp và cải thiện dịch vụ
- Xác thực danh tính người dùng
- Xử lý giao dịch và thanh toán
- Gửi thông báo và cập nhật quan trọng
- Phân tích và cải thiện trải nghiệm người dùng

3. BẢO MẬT DỮ LIỆU
- Sử dụng mã hóa SSL/TLS cho tất cả dữ liệu
- Lưu trữ mật khẩu với thuật toán hash an toàn
- Giới hạn truy cập vào dữ liệu nhạy cảm
- Thực hiện kiểm tra bảo mật thường xuyên

4. QUYỀN CỦA NGƯỜI DÙNG
Bạn có quyền:
- Truy cập thông tin cá nhân của mình
- Chỉnh sửa hoặc xóa thông tin
- Từ chối nhận email tiếp thị
- Yêu cầu xóa tài khoản`,
  },
  {
    id: "2",
    title: "Điều khoản dịch vụ",
    content: `1. PHẠM VI DỊCH VỤ
SocialCommerce cung cấp nền tảng để người dùng mua bán các sản phẩm và dịch vụ. Chúng tôi không phải là bên chịu trách nhiệm pháp lý cho các giao dịch giữa người mua và người bán.

2. TRÁCH NHIỆM NGƯỜI DÙNG
Người dùng phải:
- Cung cấp thông tin trung thực và chính xác
- Không vi phạm quyền của người khác
- Không đăng tải nội dung bất hợp pháp
- Tuân thủ tất cả luật pháp hiện hành
- Không sử dụng dịch vụ để lừa đảo hoặc gây hại

3. HẠN CHẾ TRÁCH NHIỆM
SocialCommerce không chịu trách nhiệm cho:
- Tổn thất kinh tế do giao dịch
- Các sản phẩm bị hỏng hoặc lỗi
- Tranh chấp giữa người mua và người bán
- Mất dữ liệu không thể phục hồi

4. HỦY DỊCH VỤ
Chúng tôi có quyền hủy tài khoản nếu:
- Vi phạm điều khoản dịch vụ
- Hoạt động gian lận hoặc bất hợp pháp
- Vi phạm quyền sở hữu trí tuệ
- Tấn công bảo mật hệ thống`,
  },
  {
    id: "3",
    title: "Chính sách thanh toán và hoàn tiền",
    content: `1. PHƯƠNG THỨC THANH TOÁN
Chúng tôi chấp nhận các phương thức thanh toán sau:
- Thẻ tín dụng/ghi nợ (Visa, Mastercard)
- Ví điện tử (Momo, ZaloPay, PayPal)
- Chuyển khoản ngân hàng
- Thanh toán khi nhận hàng (COD)

2. HỦY GIAO DỊCH
- Giao dịch có thể bị hủy trong vòng 24 giờ sau khi đặt hàng
- Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc
- Không áp dụng phí hủy đơn hàng trong thời gian quy định

3. HOÀN TIỀN
Người mua có quyền hoàn tiền nếu:
- Sản phẩm không đúng như mô tả
- Sản phẩm bị hỏng hoặc lỗi
- Không nhận được hàng sau 30 ngày
- Sản phẩm giả hoặc nhái

4. QUY TRÌNH HOÀN TIỀN
- Yêu cầu hoàn tiền trong vòng 7 ngày nhận hàng
- Cung cấp bằng chứng (ảnh, video)
- Chờ xác nhận từ người bán (3-5 ngày)
- Hoàn tiền sau khi trả hàng về`,
  },
  {
    id: "4",
    title: "Chính sách đổi trả hàng",
    content: `1. ĐIỀU KIỆN ĐỔI TRẢ
Sản phẩm có thể đổi/trả nếu:
- Lỗi từ nhà sản xuất
- Khác biệt với mô tả
- Bị hỏng hóc trong quá trình vận chuyển
- Sản phẩm giả hoặc không rõ nguồn gốc

2. THỜI GIAN ĐỖI TRẢ
- Tối đa 7 ngày kể từ ngày nhận hàng
- Hàng đổi/trả phải còn nguyên vẹn, không sử dụng
- Còn tag, hóa đơn và bao bì đầy đủ

3. QUY TRÌNH ĐỐI TRẢ
- Liên hệ người bán/SocialCommerce support
- Chụp ảnh/video chứng minh lỗi
- Gửi hàng về (cước phí do người dùng trả)
- Chờ kiểm tra và xác nhận từ người bán
- Nhận hàng mới hoặc tiền hoàn lại

4. HÀNG KHÔNG ĐƯỢC ĐỔI TRẢ
- Hàng đã sử dụng hoặc bị bẩn
- Mua nhầm, thay đổi ý định
- Hàng được tặng kèm miễn phí`,
  },
];

export function PoliciesContent({
  policies = defaultPolicies,
}: PoliciesContentProps) {
  const policyIcons = {
    "1": Lock,      // Bảo mật
    "2": FileText,  // Điều khoản
    "3": CreditCard, // Thanh toán
    "4": RefreshCw,  // Đổi trả
  };

  const policyImages = {
    "1": "https://images.unsplash.com/photo-1563013544-824acc1e917b?w=600&h=400&fit=crop", // Bảo mật
    "2": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", // Điều khoản
    "3": "https://images.unsplash.com/photo-1434490038056-8b7b4f93de67?w=600&h=400&fit=crop", // Thanh toán
    "4": "https://images.unsplash.com/photo-1590958423695-ae40ceb62d6b?w=600&h=400&fit=crop", // Đổi trả
  };

  return (
    <div className="grid gap-4">
      {policies.map((policy) => (
        <Card key={policy.id} className="p-6 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex gap-4">
            {/* Image */}
            <div className="shrink-0 w-32 h-32">
              <img
                src={policyImages[policy.id as keyof typeof policyImages]}
                alt={policy.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const IconComponent = policyIcons[policy.id as keyof typeof policyIcons];
                  return <IconComponent className="w-6 h-6 text-blue-600" />;
                })()}
                <h2 className="text-lg font-semibold">{policy.title}</h2>
              </div>
              <p className="text-gray-700 text-sm line-clamp-4 whitespace-pre-wrap">
                {policy.content}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
