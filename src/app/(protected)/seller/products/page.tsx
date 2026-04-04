import { getSession } from "@/features/auth/lib/getSession";
import { SellerProductsManager } from "@/features/seller/components/products/SellerProductsManager";
import { redirect } from "next/navigation";

export default async function SellerProductsPage() {
  const session = await getSession();

  if (!session?._id) {
    redirect("/login");
  }

  return <SellerProductsManager />;
}
