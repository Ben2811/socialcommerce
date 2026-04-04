import { ProductList } from "@/features/products";
import { productService } from "@/features/products/services/products.service";
import { userService } from "@/features/profile/services/users.service";
import { ChatButton } from "@/features/chat/components/ChatButton";
import { User as UserIcon, Store, Package, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function SellerShopPage(
  params: PageProps<"/shop/[sellerId]">,
) {
  const { sellerId } = await params.params;

  const [userResponse, productsResponse] = await Promise.all([
    userService.getUserById(sellerId),
    productService.getProducts({ ownerId: sellerId }).catch(() => null),
  ]);

  if (!userResponse.success && userResponse.status !== 404) {
    throw new Error(userResponse.message || "Failed to fetch seller profile");
  }

  const seller = userResponse.data;

  if (!userResponse.success || !seller) {
    redirect("/");
  }

  const initialProductsPage = productsResponse?.success
    ? productsResponse
    : undefined;
  const totalProducts = initialProductsPage?.data?.totalItems;

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
                  <UserIcon className="w-12 h-12" />
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
                  <span>
                    {typeof totalProducts === "number"
                      ? `${totalProducts} Sản phẩm`
                      : "Sản phẩm"}
                  </span>
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
                )}
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <ChatButton
                sellerId={sellerId}
                sellerName={seller.username}
                label="Chat ngay"
                className="md:flex-none px-6 py-2.5 border-zinc-200 hover:bg-zinc-50 text-zinc-700 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Sản phẩm</h2>
        </div>

        <ProductList
          filter={{ ownerId: sellerId }}
          initialProductsPage={initialProductsPage}
        />
      </div>
    </main>
  );
}
