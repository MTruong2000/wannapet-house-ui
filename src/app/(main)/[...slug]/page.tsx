"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const VALID_PAGES: Record<
  string,
  { label: string; emoji: string; description: string }
> = {
  "san-pham-cho-cho": {
    label: "Sản phẩm cho chó",
    emoji: "🐶",
    description: "Tất cả sản phẩm dành riêng cho cún cưng của bạn",
  },
  "san-pham-cho-meo": {
    label: "Sản phẩm cho mèo",
    emoji: "🐱",
    description: "Tất cả sản phẩm dành riêng cho mèo cưng của bạn",
  },
  "phu-kien": {
    label: "Phụ kiện",
    emoji: "🎀",
    description: "Phụ kiện và đồ chơi cho thú cưng",
  },
};

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

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2906";

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
        className="relative rounded-2xl overflow-hidden bg-[#F8F3E1] flex flex-col"
        style={{ width: "100%", aspectRatio: "3/4" }}
      >
        {discountPct && (
          <div
            className="absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-xs font-bold text-white"
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
            <div className="w-full h-full flex items-center justify-center bg-[#EDE8D4]">
              <span className="text-4xl opacity-30">🐾</span>
            </div>
          )}
        </div>

        <div
          className="px-3 py-2"
          style={{ background: "rgba(59,78,30,0.08)" }}
        >
          <p
            className="text-xs font-semibold line-clamp-2 leading-tight text-center"
            style={{ color: "#3B4E1E" }}
          >
            {product.name}
          </p>
          <div className="mt-1 flex items-center justify-center gap-2 flex-wrap">
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

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl bg-[#EDE8D4] animate-pulse"
      style={{ aspectRatio: "3/4", width: "100%" }}
    />
  );
}

function CategorySection({ block }: { block: CategoryBlock }) {
  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="h-px flex-1 rounded-full"
          style={{
            background: "linear-gradient(to right, transparent, #CEE672)",
          }}
        />
        <h2
          className="text-lg font-extrabold tracking-wider uppercase whitespace-nowrap"
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

      <div className="flex justify-center mt-5">
        <Link
          href={`/danh-muc/${block.category_slug}`}
          className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#3B4E1E" }}
        >
          Xem thêm {block.category_name}
        </Link>
      </div>
    </section>
  );
}

export default function DynamicCategoryPage() {
  const params = useParams();

  const slugArr = params.slug as string[];
  const slug = slugArr?.length === 1 ? slugArr[0] : null;

  const pageInfo = slug ? VALID_PAGES[slug] : null;
  if (!pageInfo) {
    notFound();
  }

  const [blocks, setBlocks] = useState<CategoryBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const locationSlug = localStorage.getItem("selected_location_slug") || "";

    if (!locationSlug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Vui lòng chọn chi nhánh để xem sản phẩm.");
      setLoading(false);
      return;
    }

    const url = `${BASE_URL}/api/products-by-category?sku_location=${encodeURIComponent(
      locationSlug
    )}&sku_category=${encodeURIComponent(slug!)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: CategoryBlock[]) => setBlocks(data))
      .catch((err) => {
        console.error(err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--primary-color, #A8BC70)" }}
    >
      <div
        className="w-full py-10 px-4 text-center"
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

      <div className="w-full max-w-5xl mx-auto px-4 pb-16 space-y-12">
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <section key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 rounded-full bg-white/30" />
                  <div className="h-5 w-48 rounded-full bg-white/40 animate-pulse" />
                  <div className="h-px flex-1 rounded-full bg-white/30" />
                </div>
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(160px, 1fr))",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, j) => (
                    <SkeletonCard key={j} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">😿</span>
            <p
              className="text-base font-semibold text-center"
              style={{ color: "#3B4E1E" }}
            >
              {error}
            </p>
          </div>
        )}

        {!loading && !error && blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl">🐾</span>
            <p className="text-base font-semibold" style={{ color: "#3B4E1E" }}>
              Chưa có sản phẩm tại chi nhánh này.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          blocks.map((block) => (
            <CategorySection key={block.category_id} block={block} />
          ))}
      </div>
    </main>
  );
}
