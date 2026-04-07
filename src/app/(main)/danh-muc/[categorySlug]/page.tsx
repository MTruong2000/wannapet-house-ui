"use client";

import { useEffect, useMemo, useState, memo } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface ApiResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "name_asc", label: "A → Z" },
  { value: "name_desc", label: "Z → A" },
];

function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const [sort, setSort] = useState("newest");
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 12;

  const pageTitle = useMemo(() => {
    return categorySlug?.replace(/-/g, " ") || "";
  }, [categorySlug]);

  useEffect(() => {
    const locationSlug = localStorage.getItem("selected_location_slug") || "";

    if (!locationSlug || !categorySlug) {
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({
          sku_location: locationSlug,
          sku_category: categorySlug,
          search: debouncedSearch,
          sort,
          page: String(page),
          limit: String(limit),
          in_stock: String(inStock),
        });

        if (appliedMinPrice) {
          params.set("min_price", appliedMinPrice);
        }

        if (appliedMaxPrice) {
          params.set("max_price", appliedMaxPrice);
        }

        const res = await fetch(
          `${BASE_URL}/api/products?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const json: ApiResponse = await res.json();

        setProducts(json.data ?? []);
        setTotal(json.total ?? 0);
        setTotalPages(json.total_pages ?? 1);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Fetch products failed:", error);
          setProducts([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [
    categorySlug,
    debouncedSearch,
    sort,
    page,
    inStock,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleApplyPriceFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setPage(1);
  };

  const handleToggleInStock = (checked: boolean) => {
    setInStock(checked);
    setPage(1);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-3 flex items-center gap-1 text-sm"
            style={{ color: "#3B4E1E" }}
          >
            ← Quay lại
          </button>

          <h1
            className="text-2xl font-bold capitalize"
            style={{ color: "#3B4E1E" }}
          >
            {pageTitle}
          </h1>

          <p className="mt-1 text-sm" style={{ color: "#6b7c3f" }}>
            {total} sản phẩm
          </p>
        </div>

        <div
          className="mb-6 flex flex-wrap gap-3 rounded-2xl p-4"
          style={{ background: "#fff" }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="min-w-[200px] flex-1 rounded-full border px-4 py-2 text-sm outline-none"
            style={{ borderColor: "#CEE672", minWidth: 200 }}
          />

          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
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
              onClick={handleApplyPriceFilter}
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
              onChange={(e) => handleToggleInStock(e.target.checked)}
            />
            <span style={{ color: "#3B4E1E" }}>Còn hàng</span>
          </label>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: limit }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl"
                style={{ height: 280, background: "#e8e0d0" }}
              />
            ))}
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

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40"
              style={{ background: "#3B4E1E", color: "#fff" }}
            >
              ← Trước
            </button>

            <span className="px-4 py-2 text-sm" style={{ color: "#3B4E1E" }}>
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
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
