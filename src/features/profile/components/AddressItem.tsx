"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/features/shared/utils/cn";
import type { Address } from "../types/address.interface";

interface AddressItemProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export function AddressItem({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault,
}: AddressItemProps) {
  const fullAddress = `${address.street}, Phường ${address.ward}, Quận ${address.district}, ${address.city}`;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 flex flex-col gap-3",
        address.isDefault
          ? "border-orange-400 bg-orange-50/40"
          : "border-border bg-white",
      )}
    >
      <div className="flex items-start gap-3">
        <MapPin
          className={cn(
            "h-4 w-4 mt-0.5 shrink-0",
            address.isDefault ? "text-orange-500" : "text-muted-foreground",
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">
              {address.recipientName} | {address.phone}
            </span>
            {address.isDefault && (
              <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0 h-4">
                Mặc định
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{fullAddress}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onEdit(address)}
        >
          Chỉnh sửa
        </Button>

        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs border-orange-400 text-orange-500 hover:bg-orange-50"
            onClick={() => onSetDefault(address._id)}
            disabled={isSettingDefault}
          >
            Đặt làm mặc định
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => onDelete(address._id)}
          disabled={isDeleting}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
}
