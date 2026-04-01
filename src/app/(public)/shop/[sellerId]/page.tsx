import { ProductList } from "@/features/products";
import { productService } from "@/features/products/services/products.service";
import { API_ENDPOINTS } from "@/features/shared/constants/endpoints";
import { URLBuilder } from "@/features/shared/lib/urlbuilder";
import { apiClient } from "@/features/shared/api/client";
import { User, Store, Package, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Product } from "@/features/products/types";

import { userRole } from "@/features/shared/types/user";

interface SellerProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  address?: string;
  phonenumber?: string;
  imageUrls?: string[];
}

export default async function SellerShopPage({
  params,
}: {
  params: Promise<{ sellerId: string }>;
}) {
  const { sellerId } = await params;

  const userUrl = new URLBuilder()
    .addPath(API_ENDPOINTS.users)
    .addParam(sellerId)
    .build();

  const [userResponse, productsResponse] = await Promise.all([
    apiClient.get<SellerProfile>(userUrl),
    productService.getProducts({ ownerId: sellerId, limit: 1 }).catch(() => null),
  ]);

  if (!userResponse.success && userResponse.status !== 404) {
    throw new Error(userResponse.message || "Failed to fetch seller profile");
  }

  const seller = userResponse.data;

  if (!userResponse.success || !seller || (seller.role !== userRole.SELLER && seller.role !== userRole.ADMIN)) {
    return notFound();
  }

  const totalProducts = productsResponse?.data?.totalItems || 0;

  return (
    <main className="min-h-screen bg-zinc-50 pb-12">
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
          <div className="h-48 md:h-64 w-full bg-gradient-to-r from-rose-400 to-fuchsia-400 rounded-b-3xl relative overflow-hidden flex items-center justify-center shadow-inner">
            {seller.imageUrls?.[1] ? (
              <Image
                src={seller.imageUrls[1]}
                alt={`${seller.username} banner`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-black/5" />
                <Store className="w-24 h-24 text-white/30" />
              </>
            )}
          </div>

          <div className="relative -mt-16 pb-8 px-4 flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md relative overflow-hidden flex-shrink-0">
              {seller.imageUrls?.[0] ? (
                <Image
                  src={seller.imageUrls[0]}
                  alt={seller.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-2">
                {seller.username}
                <span className="text-xs font-semibold px-2 py-1 bg-rose-100 text-rose-600 rounded-lg uppercase tracking-wider">
                  Official Shop
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  <span>{totalProducts} Sản phẩm</span>
                </div>
                {seller.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.address}</span>
                  </div>
                )}
                {seller.phonenumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{seller.phonenumber}</span>
                  </div>
                )}
                {seller.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>{seller.email}</span>
                  </div>
                )
                }
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-50 font-medium rounded-xl transition text-zinc-700 shadow-sm">
                Chat ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Sản phẩm</h2>
        </div>

        <ProductList filter={{ ownerId: sellerId }} />
      </div>
    </main>
  );
}
