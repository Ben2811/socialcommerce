import { TruckIcon, RotateCcwIcon, CreditCardIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Policy {
  icon: LucideIcon;
  label: string;
  value: string;
}

const POLICIES: Policy[] = [
  { icon: TruckIcon, label: "Giao hàng", value: "Miễn phí nội thành" },
  { icon: RotateCcwIcon, label: "Đổi trả", value: "Trong 7 ngày" },
  { icon: CreditCardIcon, label: "Thanh toán", value: "COD, thẻ, CK" },
];

export function ProductPolicies() {
  return (
    <div className="rounded-xl border p-4">
      <div className="grid grid-cols-3 divide-x">
        {POLICIES.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 px-3 text-center"
          >
            <Icon className="size-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xs font-medium">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}