"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { memo, useState } from "react";
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

interface CategoryPageClientProps {
  categorySlug: string;
  pageTitle: string;
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  initialSearch: string;
  initialSort: string;
  initialInStock: boolean;
  initialMinPrice: string;
  initialMaxPrice: string;
  error: string | null;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "A → Z" },
  { value: "name_desc", label: "Z → A" },
];

export default function CategoryPageClient({
  categorySlug,
  pageTitle,
  products,
  total,
  totalPages,
  currentPage,
  initialSearch,
  initialSort,
  initialInStock,
  initialMinPrice,
  initialMaxPrice,
  error,
}: CategoryPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [inStock, setInStock] = useState(initialInStock);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  const buildUrl = (
    overrides?: Record<string, string | number | boolean | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    const merged: Record<string, string> = {
      search,
      sort,
      in_stock: String(inStock),
      min_price: minPrice,
      max_price: maxPrice,
      page: String(currentPage),
    };

    Object.entries(overrides || {}).forEach(([key, value]) => {
      if (value === undefined) return;
      merged[key] = String(value);
    });

    Object.entries(merged).forEach(([key, value]) => {
      if (!value || (value === "false" && key !== "in_stock")) {
        params.delete(key);
      } else if (key === "in_stock" && value === "false") {
        params.delete(key);
      } else if (key === "page" && value === "1") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    return `/danh-muc/${categorySlug}?${params.toString()}`;
  };

  const applyFilters = () => {
    router.push(
      buildUrl({
        search,
        sort,
        in_stock: inStock,
        min_price: minPrice,
        max_price: maxPrice,
        page: 1,
      })
    );
  };

  const changePage = (page: number) => {
    router.push(buildUrl({ page }));
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold capitalize"
            style={{ color: "#3B4E1E" }}
          >
            {pageTitle}
          </h1>

          {!error && (
            <p className="mt-1 text-sm" style={{ color: "#6b7c3f" }}>
              {total} sản phẩm
            </p>
          )}
        </div>

        <div
          className="mb-6 flex flex-wrap gap-3 rounded-2xl p-4"
          style={{ background: "#fff" }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[200px] flex-1 rounded-full border px-4 py-2 text-sm outline-none"
            style={{ borderColor: "#CEE672", minWidth: 200 }}
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border px-4 py-2 text-sm outline-none"
            style={{ borderColor: "#CEE672" }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Giá từ"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 rounded-full border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#CEE672" }}
            />

            <span className="text-sm" style={{ color: "#6b7c3f" }}>
              –
            </span>

            <input
              type="number"
              placeholder="Đến"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 rounded-full border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#CEE672" }}
            />

            <button
              onClick={applyFilters}
              className="rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ background: "#3B4E1E" }}
            >
              Lọc
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            <span style={{ color: "#3B4E1E" }}>Còn hàng</span>
          </label>
        </div>

        {error ? (
          <div className="py-20 text-center" style={{ color: "#9B8B6A" }}>
            <p className="text-lg">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center" style={{ color: "#9B8B6A" }}>
            <p className="text-lg">Không tìm thấy sản phẩm nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <MemoProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!error && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => changePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40"
              style={{ background: "#3B4E1E", color: "#fff" }}
            >
              ← Trước
            </button>

            <span className="px-4 py-2 text-sm" style={{ color: "#3B4E1E" }}>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40"
              style={{ background: "#3B4E1E", color: "#fff" }}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const MemoProductCard = memo(function ProductCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl transition-transform hover:scale-[1.02]"
      style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div
          style={{ position: "relative", width: "100%", paddingTop: "100%" }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "#F8F3E1" }}
            >
              <span style={{ fontSize: 40 }}>🐾</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <p
            className="mb-1 line-clamp-2 text-sm font-medium leading-snug"
            style={{ color: "#3B4E1E" }}
          >
            {product.name}
          </p>

          {product.is_contact_price ? (
            <p className="text-sm font-bold" style={{ color: "#e07b39" }}>
              Liên hệ
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold" style={{ color: "#e07b39" }}>
                {product.price.toLocaleString("vi-VN")} ₫
              </p>

              {product.compare_price ? (
                <p
                  className="text-xs line-through"
                  style={{ color: "#9B8B6A" }}
                >
                  {product.compare_price.toLocaleString("vi-VN")} ₫
                </p>
              ) : null}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
});
