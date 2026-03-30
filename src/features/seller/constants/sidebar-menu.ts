import {
  ShoppingBag,
  ClipboardList,
  Receipt,
  Percent,
  Megaphone,
  HelpCircle,
  Settings,
} from "lucide-react";

export const sellerManagementItems = [
  {
    label: "Sản phẩm",
    href: "/seller/products",
    icon: ShoppingBag,
  },
  {
    label: "Đơn đặt hàng",
    href: "/seller/orders",
    icon: ClipboardList,
  },
  {
    label: "Hóa đơn",
    href: "/seller/bills",
    icon: Receipt,
  },
  {
    label: "Giảm giá",
    href: "/seller/discounts",
    icon: Percent,
  },
  {
    label: "Quảng cáo",
    href: "/seller/ads",
    icon: Megaphone,
  },
];

export const sellerSupportLink = {
  label: "Hỗ trợ",
  href: "/seller/support",
  icon: HelpCircle,
};

export const sellerSettingsLink = {
  label: "Cài đặt",
  href: "/seller/settings",
  icon: Settings,
};
