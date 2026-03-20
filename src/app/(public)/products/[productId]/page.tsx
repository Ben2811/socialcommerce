import { productService } from "@/features/products/services/products.service";
import { Product } from "@/features/products/types/product.interface";
import Image from "next/image";
import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatPrice(price?: number) {
  if (typeof price !== "number" || Number.isNaN(price)) return "Liên hệ";
  return currencyFormatter.format(price);
}

function getAverageRating(rating?: number) {
  if (typeof rating !== "number" || Number.isNaN(rating)) return "4.6";
  return rating.toFixed(1);
}

function StarRating({ rating = 4.6 }: { rating?: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Đánh giá ${rating} trên 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < fullStars;
        const half = index === fullStars && hasHalfStar;

        return (
          <span key={index} className="text-sm leading-none">
            {filled || half ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default async function ProductDetailsPage(
  params: PageProps<"/products/[productId]">,
) {
  const { productId } = await params.params;
  const response = await productService.getProductById(productId);
  const product = response.data as Product | null;

  const title = product?.name || "Sản phẩm";
  const rating = getAverageRating();
  const reviewCount = 123;

  const primaryImage = product?.imageUrls?.[0];
  const galleryImages = product?.imageUrls ?? [];

  const price = product?.displayPrice;
  const discountPercent = undefined;

  const description =
    product?.description ||
    "Sản phẩm được thiết kế để mang lại trải nghiệm tốt hơn, với giao diện hiện đại, độ bền cao và khả năng sử dụng linh hoạt cho nhiều nhu cầu khác nhau.";

  const features = [
    "Thiết kế tối ưu cho trải nghiệm gaming",
    "Cảm biến và độ chính xác cao",
    "Chất liệu bền, cầm nắm thoải mái",
    "Phù hợp cho sử dụng hằng ngày và chơi game",
  ];

  const specs = [
    { label: "Danh mục", value: product?.categoryId || "Phụ kiện máy tính" },
    { label: "Tình trạng", value: product?.inStock ? "Còn hàng" : "Hết hàng" },
    {
      label: "Bảo hành",
      value: product?.variants?.[0]?.sku || "12 tháng",
    },
    { label: "SKU", value: product?.variants?.[0]?.sku || "Standard" },
  ];

  const variants = product?.variants?.length
    ? product.variants.map((variant) => ({
        label: "SKU",
        value: variant.sku,
      }))
    : [{ label: "SKU", value: "Standard" }];

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/product" },
    { label: title, href: `/product/${productId}` },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 ? <span className="text-zinc-300">/</span> : null}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-zinc-900">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-zinc-900">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200/80">
            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-950 to-zinc-800 p-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.25),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.18),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.1),transparent_30%)]" />
                <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900">
                  <Image
                    src={primaryImage || "/placeholder-product.jpg"}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {galleryImages.length > 1 ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Ảnh trước"
                    className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                  >
                    ‹
                  </button>

                  <div className="grid flex-1 grid-cols-3 gap-3 sm:grid-cols-4">
                    {galleryImages.slice(0, 4).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`overflow-hidden rounded-2xl border bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                          index === 0
                            ? "border-rose-500 ring-2 ring-rose-100"
                            : "border-zinc-200"
                        }`}
                        aria-label={`Chọn ảnh ${index + 1}`}
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                          <Image
                            src={image}
                            alt={title}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    aria-label="Ảnh tiếp"
                    className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
                  >
                    ›
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <div className="flex items-center gap-2 font-medium text-zinc-900">
                    <StarRating rating={Number(rating)} />
                    <span>{rating}</span>
                  </div>
                  <span className="text-zinc-300">|</span>
                  <span>{reviewCount} Đánh giá</span>
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
                    {title}
                  </h1>
                </div>
              </div>

              <button
                type="button"
                aria-label="Yêu thích"
                className="grid h-11 w-11 place-items-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition hover:border-rose-200 hover:text-rose-500"
              >
                ♡
              </button>
            </div>

            <div className="mt-6 rounded-3xl bg-zinc-50 p-5 ring-1 ring-zinc-200/80">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-4xl font-extrabold tracking-tight text-rose-500">
                  {formatPrice(price)}
                </p>
                {discountPercent ? (
                  <span className="mb-1 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-600">
                    -{discountPercent}%
                  </span>
                ) : null}
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-700">
                {description}
              </p>
            </div>

            <div className="mt-6 grid gap-6">
              <div>
                <SectionTitle
                  title="Tùy chọn sản phẩm"
                  subtitle="Chọn phiên bản phù hợp với nhu cầu của bạn."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {variants.map((variant) => (
                    <div
                      key={`${variant.label}-${variant.value}`}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {variant.label}
                      </p>
                      <p className="mt-1 font-semibold text-zinc-900">
                        {variant.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle title="Số lượng" />
                <div className="flex items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center text-xl text-zinc-600 transition hover:bg-zinc-50"
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <div className="min-w-14 px-4 text-center text-sm font-semibold text-zinc-900">
                      1
                    </div>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center text-xl text-zinc-600 transition hover:bg-zinc-50"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {product?.inStock ? "Còn hàng" : "Hết hàng"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-500 bg-white px-5 py-3.5 font-semibold text-rose-500 transition hover:bg-rose-50"
                >
                  <span>🛒</span>
                  Thêm Vào Giỏ Hàng
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl bg-rose-500 px-6 py-3.5 font-semibold text-white transition hover:bg-rose-600"
                >
                  Mua Ngay
                </button>
              </div>

              <div className="grid gap-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Giao hàng
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    Miễn phí nội thành
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Đổi trả
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    Trong 7 ngày
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Thanh toán
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    COD, thẻ, chuyển khoản
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80">
            <SectionTitle
              title="Thông tin sản phẩm"
              subtitle="Mô tả ngắn gọn giúp khách hàng hiểu ngay giá trị sản phẩm."
            />
            <div className="space-y-4 text-sm leading-7 text-zinc-700">
              <p>{description}</p>
              <ul className="grid gap-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80">
            <SectionTitle
              title="Thông số kỹ thuật"
              subtitle="Thông tin rõ ràng, dễ so sánh khi mua hàng."
            />
            <dl className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200">
              {specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-2 gap-4 px-4 py-3">
                  <dt className="text-sm font-medium text-zinc-500">{spec.label}</dt>
                  <dd className="text-sm font-semibold text-zinc-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80">
          <SectionTitle
            title="Đánh giá khách hàng"
            subtitle="Hiển thị review để tăng độ tin cậy và chuyển đổi."
          />

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="rounded-3xl bg-zinc-50 p-5 ring-1 ring-zinc-200/80">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-zinc-950">{rating}</p>
                <div className="mt-2 flex justify-center text-amber-500">
                  <StarRating rating={Number(rating)} />
                </div>
                <p className="mt-2 text-sm text-zinc-500">{reviewCount} lượt đánh giá</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Nguyễn Minh",
                  time: "2 ngày trước",
                  content:
                    "Sản phẩm đóng gói tốt, cầm rất chắc tay và đúng mô tả. Giao diện trang sản phẩm rõ ràng nên mình quyết định mua khá nhanh.",
                },
                {
                  name: "Trần Anh",
                  time: "1 tuần trước",
                  content:
                    "Thiết kế đẹp, phần CTA nổi bật. Mình thích cách hiển thị thông tin ngắn gọn nhưng đủ ý, rất dễ đọc trên mobile.",
                },
              ].map((review) => (
                <article
                  key={`${review.name}-${review.time}`}
                  className="rounded-2xl border border-zinc-200 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-zinc-900">{review.name}</h3>
                      <p className="text-xs text-zinc-500">{review.time}</p>
                    </div>
                    <div className="text-amber-500">
                      <StarRating rating={5} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-700">{review.content}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/80">
          <SectionTitle
            title="Sản phẩm liên quan"
            subtitle="Gợi ý thêm các lựa chọn tương tự để tăng khám phá."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Gaming Mouse Pro", price: "490.000 VND" },
              { name: "Mouse Pad XL", price: "180.000 VND" },
              { name: "Keyboard Switch Kit", price: "350.000 VND" },
              { name: "Wrist Rest Comfort", price: "220.000 VND" },
            ].map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-zinc-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-square rounded-xl bg-linear-to-br from-zinc-100 to-zinc-200" />
                <h3 className="mt-4 font-semibold text-zinc-900">{item.name}</h3>
                <p className="mt-1 text-sm font-medium text-rose-500">{item.price}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}