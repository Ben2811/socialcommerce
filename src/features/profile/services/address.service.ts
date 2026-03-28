import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { BaseResponse } from "@/types/global.types";
import type { Address, CreateAddressInput, UpdateAddressInput } from "../types/address.interface";

export class AddressService {
  private url(path?: string): string {
    const builder = new URLBuilder().addPath(API_ENDPOINTS.addresses);
    if (path) builder.addParam(path);
    return builder.build();
  }

  async getAddresses(accessToken: string): Promise<BaseResponse<Address[]>> {
    return apiClient.get<Address[]>(this.url(), accessToken);
  }

  async getDefaultAddress(accessToken: string): Promise<BaseResponse<Address | null>> {
    return apiClient.get<Address | null>(this.url("default"), accessToken);
  }

  async addAddress(input: CreateAddressInput, accessToken: string): Promise<BaseResponse<Address>> {
    return apiClient.post<CreateAddressInput, Address>(this.url(), input, accessToken);
  }

  async updateAddress(id: string, input: UpdateAddressInput, accessToken: string): Promise<BaseResponse<Address>> {
    return apiClient.patch<UpdateAddressInput, Address>(this.url(id), input, accessToken);
  }

  async deleteAddress(id: string, accessToken: string): Promise<BaseResponse<boolean>> {
    return apiClient.delete<boolean>(this.url(id), accessToken);
  }

  async setDefaultAddress(id: string, accessToken: string): Promise<BaseResponse<Address>> {
    return apiClient.patch<Record<string, never>, Address>(
      this.url(`${id}/set-default`),
      {},
      accessToken,
    );
  }
}

export const addressService = new AddressService();
