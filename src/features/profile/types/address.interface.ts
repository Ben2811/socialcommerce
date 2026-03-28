import { z } from "zod";

export const addressSchema = z.object({
  recipientName: z.string().min(1, "Tên người nhận không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
  street: z.string().min(1, "Địa chỉ không được để trống"),
  ward: z.string().min(1, "Phường/Xã không được để trống"),
  district: z.string().min(1, "Quận/Huyện không được để trống"),
  city: z.string().min(1, "Tỉnh/Thành phố không được để trống"),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export interface Address extends AddressFormData {
  _id: string;
}

export interface CreateAddressInput extends AddressFormData {}

export interface UpdateAddressInput extends Partial<AddressFormData> {}
