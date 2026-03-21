import {
  ShoppingBag,
  Tags,
  Users,
  LayoutGrid,
  Megaphone,
  ShieldCheck,
  Phone,
  Settings,
} from "lucide-react";

export const managementItems = [
  { label: "Sản phẩm", href: "/admin/products", icon: ShoppingBag },
  { label: "Người dùng", href: "/admin/users", icon: Users },
  { label: "Danh mục", href: "/admin/categories", icon: Tags },
];

export const contentItems = [
  { label: "About", href: "/dashboard/about", icon: LayoutGrid },
  { label: "Quy định và chính sách", href: "/dashboard/policies", icon: ShieldCheck },
  { label: "Quảng cáo", href: "/dashboard/ads", icon: Megaphone },
];

export const supportLink = {
  label: "Hỗ trợ",
  href: "/support",
  icon: Phone,
};

export const settingsLink = {
  label: "Cài đặt",
  href: "/settings",
  icon: Settings,
};
