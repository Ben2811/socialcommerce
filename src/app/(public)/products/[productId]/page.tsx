        import { productService } from "@/features/products/services/products.service";
import { Product } from "@/features/products/types/product.interface";
import { getSession } from "@/features/auth/lib/getSession";
import {
  ProductReviewSection,
  reviewService,
  type ProductReviewsBundle,
} from "@/features/reviews";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProductBreadcrumb } from "@/features/products/components/product-detail/ProductBreadcrumb";
import { ProductGallery } from "@/features/products/components/product-detail/ProductGallery";
import { ProductHeader } from "@/features/products/components/product-detail/ProductHeader";
import { ProductPricing } from "@/features/products/components/product-detail/ProductPricing";
import { ProductVariants } from "@/features/products/components/product-detail/ProductVariants";
import { ProductActions } from "@/features/products/components/product-detail/ProductActions";
import { ProductSpecs } from "@/features/products/components/product-detail/ProductSpecs";
import { ProductPolicies } from "@/features/products/components/product-detail/ProductPolicies";
import { ProductDescription } from "@/features/products/components/product-detail/ProductDescription";

const EMPTY_REVIEWS_BUNDLE: ProductReviewsBundle = {
  reviews: [],
  summary: {
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
};

function buildBreadcrumbs(productId: string, title: string) {
  return [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    { label: title, href: `/products/${productId}` },
  ];
}

function buildSpecs(product: Product | null) {
  return [
    { label: "Danh mục", value: product?.categoryId ?? "Phụ kiện máy tính" },
    { label: "Tình trạng", value: product?.inStock ? "Còn hàng" : "Hết hàng" },
    { label: "Bảo hành", value: product?.variants?.[0]?.sku ?? "12 tháng" },
    { label: "SKU", value: product?.variants?.[0]?.sku ?? "Standard" },
  ];
}

function buildVariants(product: Product | null) {
  return product?.variants ?? [];
}

export default async function ProductDetailsPage(
  params: PageProps<"/products/[productId]">,
) {
  const { productId } = await params.params;

  const [response, reviewsResponse, session] = await Promise.all([
    productService.getProductById(productId),
    reviewService.getProductReviewsBundle(productId),
    getSession(),
  ]);

  const product = response.data as Product | null;
  const reviewsBundle: ProductReviewsBundle = reviewsResponse.success
    ? reviewsResponse.data
    : EMPTY_REVIEWS_BUNDLE;

  const title = product?.name ?? "Sản phẩm";
  const rating = reviewsBundle.summary.averageRating;
  const reviewCount = reviewsBundle.summary.totalReviews;
  const description = product?.description;
  const images = product?.imageUrls ?? [];
  const inStock = product?.inStock ?? true;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 lg:px-8">
        <ProductBreadcrumb items={buildBreadcrumbs(productId, title)} />

        <section className="flex flex-col gap-6 lg:flex-row">
          <ProductGallery images={images} title={title} />

          <Card className="border-0 w-full lg:w-1/2">
            <CardContent className="space-y-5 pt-6  ">
              <ProductHeader
                title={title}
                rating={rating}
                reviewCount={reviewCount}
              />
              <Separator />
              <ProductPricing
                price={product?.displayPrice}
                description={product?.description}
              />
              <ProductVariants variants={buildVariants(product)} />
              <Separator />
              <ProductActions
                inStock={inStock}
                stockQuantity={product?.stock}
              />
              <ProductPolicies />
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-6 lg:flex-row">
          <ProductDescription description={description} />
          <ProductSpecs specs={buildSpecs(product)} />
        </section>

        <ProductReviewSection
          productId={productId}
          currentUserId={session?._id}
          initialData={reviewsBundle}
        />


      </div>
    </main>
  );
}
