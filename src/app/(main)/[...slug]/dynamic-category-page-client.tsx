"use client";

import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  compare_price: number | null;
  is_contact_price: boolean;
}

interface CategoryBlock {
  category_id: string;
  category_name: string;
  category_slug: string;
  products: Product[];
}

interface PageInfo {
  label: string;
  emoji: string;
  description: string;
}

interface DynamicCategoryPageClientProps {
  pageInfo: PageInfo;
  blocks: CategoryBlock[];
  error: string | null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  const discountPct =
    product.compare_price && product.compare_price > product.price
      ? Math.round(
          ((product.compare_price - product.price) / product.compare_price) *
            100
        )
      : null;

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div
        className="relative flex flex-col overflow-hidden rounded-2xl bg-[#F8F3E1]"
        style={{ width: "100%", aspectRatio: "3/4" }}
      >
        {discountPct && (
          <div
            className="absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: "#E05A2B" }}
          >
            -{discountPct}%
          </div>
        )}

        <div className="relative flex-1 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#EDE8D4]">
              <span className="text-4xl opacity-30">🐾</span>
            </div>
          )}
        </div>

        <div
          className="px-3 py-2"
          style={{ background: "rgba(59,78,30,0.08)" }}
        >
          <p
            className="line-clamp-2 text-center text-xs font-semibold leading-tight"
            style={{ color: "#3B4E1E" }}
          >
            {product.name}
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {product.is_contact_price ? (
              <span className="text-xs font-bold" style={{ color: "#E05A2B" }}>
                Liên hệ
              </span>
            ) : (
              <>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#3B4E1E" }}
                >
                  {formatPrice(product.price)}
                </span>

                {product.compare_price &&
                  product.compare_price > product.price && (
                    <span
                      className="text-[10px] line-through opacity-50"
                      style={{ color: "#3B4E1E" }}
                    >
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategorySection({ block }: { block: CategoryBlock }) {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="h-px flex-1 rounded-full"
          style={{
            background: "linear-gradient(to right, transparent, #CEE672)",
          }}
        />
        <h2
          className="whitespace-nowrap text-lg font-extrabold uppercase tracking-wider"
          style={{ color: "#3B4E1E", fontFamily: "'Nunito', sans-serif" }}
        >
          {block.category_name}
        </h2>
        <div
          className="h-px flex-1 rounded-full"
          style={{
            background: "linear-gradient(to left, transparent, #CEE672)",
          }}
        />
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {block.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href={`/danh-muc/${block.category_slug}`}
          className="inline-flex items-center gap-2 rounded-full px-8 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#3B4E1E" }}
        >
          Xem thêm {block.category_name}
        </Link>
      </div>
    </section>
  );
}

export default function DynamicCategoryPageClient({
  pageInfo,
  blocks,
  error,
}: DynamicCategoryPageClientProps) {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--primary-color, #A8BC70)" }}
    >
      <div
        className="w-full px-4 py-10 text-center"
        style={{
          background:
            "linear-gradient(to bottom, rgba(59,78,30,0.15), transparent)",
        }}
      >
        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: "#3B4E1E", fontFamily: "'Nunito', sans-serif" }}
        >
          {pageInfo.emoji} {pageInfo.label}
        </h1>

        <p className="mt-1 text-sm opacity-70" style={{ color: "#3B4E1E" }}>
          {pageInfo.description}
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl space-y-12 px-4 pb-16">
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <span className="text-5xl">😿</span>
            <p
              className="text-center text-base font-semibold"
              style={{ color: "#3B4E1E" }}
            >
              {error}
            </p>
          </div>
        )}

        {!error && blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <span className="text-5xl">🐾</span>
            <p className="text-base font-semibold" style={{ color: "#3B4E1E" }}>
              Chưa có sản phẩm tại chi nhánh này.
            </p>
          </div>
        )}

        {!error &&
          blocks.map((block) => (
            <CategorySection key={block.category_id} block={block} />
          ))}
      </div>
    </main>
  );
}
