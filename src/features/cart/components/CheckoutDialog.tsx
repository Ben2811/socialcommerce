"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { Loader2, MapPin, Plus, ShoppingBag } from "lucide-react";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import type { CreateOrderInput, ShippingAddress } from "@/features/orders/types/order";
import { useAddresses } from "@/features/profile/hooks/useAddress";
import type { Address } from "@/features/profile/types/address.interface";
import type { CartItem } from "../types/cart";
import { formatPrice } from "@/features/shared";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const shippingAddressSchema = z.object({
  street: z.string().min(1, "Địa chỉ không được để trống"),
  city: z.string().min(1, "Tỉnh/Thành phố không được để trống"),
  state: z.string().min(1, "Quận/Huyện không được để trống"),
  zipCode: z.string().min(1, "Mã bưu điện không được để trống"),
  country: z.string().min(1, "Quốc gia không được để trống"),
});

type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
type AddressMode = "saved" | "manual";

interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedItems: CartItem[];
}

function toShippingAddress(
  address: Address,
  fallbackZipCode = "",
): ShippingAddress {
  return {
    street: address.street,
    city: address.city,
    state: address.district,
    zipCode: fallbackZipCode,
    country: "Vietnam",
  };
}

function defaultShippingAddress(): ShippingAddressFormData {
  return {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Vietnam",
  };
}

export function CheckoutDialog({
  open,
  onClose,
  onSuccess,
  selectedItems,
}: CheckoutDialogProps) {
  const router = useRouter();
  const { data: addresses = [] } = useAddresses();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const isPending = isCreatingOrder;

  const [addressMode, setAddressMode] = useState<AddressMode>(
    addresses.length > 0 ? "saved" : "manual",
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?._id ?? "",
  );

  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    [selectedItems],
  );

  const totalQuantity = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems],
  );

  const form = useForm({
    defaultValues: defaultShippingAddress(),
    validators: {
      onSubmit: shippingAddressSchema,
    },
    onSubmit: async ({ value }) => {
      const selectedAddress =
        addressMode === "saved"
          ? addresses.find((address) => address._id === selectedAddressId)
          : undefined;

      const shippingAddress =
        addressMode === "saved" && selectedAddress
          ? toShippingAddress(selectedAddress, value.zipCode)
          : (value as ShippingAddress);

      const input: CreateOrderInput = {
        items: selectedItems.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      createOrder(input, {
        onSuccess: (order) => {
          onSuccess();
          router.push(`/payment?orderId=${order._id}`);
        },
      });
    },
  });

  if (selectedItems.length === 0) {
    return null;
  }

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] w-[min(48rem,calc(100vw-2rem))] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Xác nhận đơn hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  Sản phẩm đã chọn
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedItems.length} mặt hàng • {totalQuantity} sản phẩm
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tổng tiền</p>
                <p className="text-lg font-bold text-primary">
                  {formatPrice(totalAmount)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={`${item.productId}-${item.sku}`}
                  className="flex items-start justify-between gap-4 rounded-md bg-muted/40 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {item.productName}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>SKU: {item.sku}</span>
                      <span>•</span>
                      <span>Danh mục: {item.category?.name ?? "Chưa có"}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      x{item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">
                Địa chỉ giao hàng
              </h3>
            </div>

            <div className="space-y-4">
              {addresses.length > 0 && (
                <RadioGroup
                  value={addressMode === "saved" ? selectedAddressId : "manual"}
                  onValueChange={(value) => {
                    if (value === "manual") {
                      setAddressMode("manual");
                      return;
                    }

                    setAddressMode("saved");
                    setSelectedAddressId(value);
                  }}
                  className="space-y-3"
                >
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      htmlFor={`address-${address._id}`}
                      className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-accent/50"
                    >
                      <RadioGroupItem
                        id={`address-${address._id}`}
                        value={address._id}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground">
                            {address.recipientName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {address.phone}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {address.street}, {address.ward}, {address.district},{" "}
                          {address.city}
                        </p>
                        {address.isDefault && (
                          <p className="mt-1 text-xs font-medium text-orange-600">
                            Địa chỉ mặc định
                          </p>
                        )}
                      </div>
                    </label>
                  ))}

                  <label
                    htmlFor="address-manual"
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 hover:bg-accent/50"
                  >
                    <RadioGroupItem id="address-manual" value="manual" />
                    <div>
                      <p className="font-medium text-foreground">
                        Nhập địa chỉ mới
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dùng cho đơn hàng này
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              )}

              <div className="rounded-md bg-muted/30 p-4">
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  <FieldGroup className="grid gap-4">
                    <form.Field name="street">
                      {(field) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Địa chỉ, số nhà, tên đường
                          </FieldLabel>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                            placeholder="123 Nguyễn Huệ"
                            disabled={addressMode === "saved"}
                          />
                          <FieldError errors={field.state.meta.errors} />
                        </Field>
                      )}
                    </form.Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <form.Field name="city">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor={field.name}>
                              Tỉnh/Thành phố
                            </FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) =>
                                field.handleChange(event.target.value)
                              }
                              placeholder="TP. Hồ Chí Minh"
                              disabled={addressMode === "saved"}
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        )}
                      </form.Field>

                      <form.Field name="state">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor={field.name}>
                              Quận/Huyện
                            </FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) =>
                                field.handleChange(event.target.value)
                              }
                              placeholder="Quận 1"
                              disabled={addressMode === "saved"}
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        )}
                      </form.Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <form.Field name="zipCode">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor={field.name}>
                              Mã bưu điện
                            </FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) =>
                                field.handleChange(event.target.value)
                              }
                              placeholder="700000"
                              disabled={addressMode === "saved"}
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        )}
                      </form.Field>

                      <form.Field name="country">
                        {(field) => (
                          <Field>
                            <FieldLabel htmlFor={field.name}>
                              Quốc gia
                            </FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(event) =>
                                field.handleChange(event.target.value)
                              }
                              placeholder="Vietnam"
                              disabled={addressMode === "saved"}
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </Field>
                        )}
                      </form.Field>
                    </div>
                  </FieldGroup>

                  <Separator />

                  <div className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">
                    <p className="mb-1 font-medium text-foreground">Lưu ý</p>
                    <p>
                      Đơn hàng sẽ được tạo từ các sản phẩm bạn đã chọn trong giỏ
                      hàng. Hãy kiểm tra lại địa chỉ và số lượng trước khi xác
                      nhận.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant="orange"
            disabled={isPending}
            onClick={() => form.handleSubmit()}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo đơn hàng...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Đặt hàng & Thanh toán
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}