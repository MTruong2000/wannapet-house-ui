"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
}

interface Province {
  id: string;
  name: string;
  slug: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  image_url: string | null;
  stock: number;
  is_contact_price: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  stock_status: "in_stock" | "out_of_stock" | "low_stock";
  category: Category;
  location: Location;
  province: Province;
  breadcrumb: BreadcrumbItem[];
}

/* related_products từ get_related_products() trả về stock (number),
   không có stock_status — tự tính ở FE */
interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  is_contact_price: boolean;
}

interface ApiResponse {
  product: ProductDetail;
  related_products: RelatedProduct[];
}

/* ─── Helpers ────────────────────────────────────────────────── */
function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " ₫";
}

function discountPercent(price: number, compare: number) {
  return Math.round(((compare - price) / compare) * 100);
}

function getStockStatus(
  stock: number
): "in_stock" | "low_stock" | "out_of_stock" {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
}

function stockLabel(status: "in_stock" | "low_stock" | "out_of_stock") {
  switch (status) {
    case "in_stock":
      return { text: "Còn hàng", color: "#3B4E1E" };
    case "low_stock":
      return { text: "Sắp hết hàng", color: "#e07b39" };
    case "out_of_stock":
      return { text: "Hết hàng", color: "#9B8B6A" };
  }
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params["product-slug"] as string;
  const router = useRouter();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!productSlug) return;

    const locationSlug =
      typeof window !== "undefined"
        ? localStorage.getItem("selected_location_slug") || ""
        : "";

    const query = new URLSearchParams({ sku: productSlug });
    if (locationSlug) query.set("sku_location", locationSlug);
    query.set("include_related", "true");
    query.set("related_limit", "8");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setNotFound(false);

    fetch(`${BASE_URL}/api/product-detail?${query.toString()}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ApiResponse | null) => {
        if (json) setData(json);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [productSlug]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div
            className="mb-4 h-5 w-64 animate-pulse rounded-full"
            style={{ background: "#e8e0d0" }}
          />
          <div className="flex flex-col gap-6 md:flex-row">
            <div
              className="animate-pulse rounded-3xl md:w-[420px] md:flex-shrink-0"
              style={{ aspectRatio: "1", background: "#e8e0d0" }}
            />
            <div className="flex flex-1 flex-col gap-4">
              {[32, 60, 80, 120, 64, 64].map((h, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl"
                  style={{ height: h, background: "#e8e0d0" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !data) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4"
        style={{ background: "#f5f0e8" }}
      >
        <span style={{ fontSize: 64 }}>🐾</span>
        <p className="text-lg font-medium" style={{ color: "#3B4E1E" }}>
          Không tìm thấy sản phẩm.
        </p>
        <button
          onClick={() => router.back()}
          className="rounded-full px-6 py-2 text-sm font-medium text-white"
          style={{ background: "#3B4E1E" }}
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const { product, related_products } = data;
  const stock = stockLabel(product.stock_status);

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <button onClick={() => router.back()} style={{ color: "#3B4E1E" }}>
            ← Quay lại
          </button>
          {product.breadcrumb.map((item) => (
            <span key={item.id} className="flex items-center gap-2">
              <span style={{ color: "#9B8B6A" }}>/</span>
              <Link
                href={`/danh-muc/${item.slug}`}
                className="hover:underline"
                style={{ color: "#6b7c3f" }}
              >
                {item.name}
              </Link>
            </span>
          ))}
          <span style={{ color: "#9B8B6A" }}>/</span>
          <span
            className="line-clamp-1 max-w-[200px]"
            style={{ color: "#3B4E1E" }}
          >
            {product.name}
          </span>
        </nav>

        {/* ── Main card ── */}
        <div
          className="mb-10 overflow-hidden rounded-3xl"
          style={{
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}
        >
          <div className="flex flex-col md:flex-row">
            {/* ── Ảnh sản phẩm ── */}
            <div
              className="relative flex-shrink-0 md:w-[420px]"
              style={{ borderRight: "1px solid #f0ebe0" }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  width: "100%",
                  paddingTop: "100%",
                  background: "#F8F3E1",
                }}
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    style={{ objectFit: "cover" }}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ fontSize: 80 }}>🐾</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1">
                  {product.stock_status === "out_of_stock" && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "#9B8B6A" }}
                    >
                      Hết hàng
                    </span>
                  )}
                  {product.stock_status === "low_stock" && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "#e07b39" }}
                    >
                      Sắp hết hàng
                    </span>
                  )}
                  {product.compare_price && !product.is_contact_price && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "#e07b39" }}
                    >
                      -{discountPercent(product.price, product.compare_price)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Thông tin sản phẩm ── */}
            <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
              {/* Category tag */}
              <Link
                href={`/danh-muc/${product.category.slug}`}
                className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: "#eef5d0", color: "#3B4E1E" }}
              >
                {product.category.name}
              </Link>

              <h1
                className="text-2xl font-bold leading-snug"
                style={{ color: "#3B4E1E" }}
              >
                {product.name}
              </h1>

              {/* Giá */}
              <div className="flex items-end gap-3">
                {product.is_contact_price ? (
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "#e07b39" }}
                  >
                    Liên hệ để biết giá
                  </span>
                ) : (
                  <>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "#e07b39" }}
                    >
                      {formatVND(product.price)}
                    </span>
                    {product.compare_price && (
                      <span
                        className="mb-1 text-base line-through"
                        style={{ color: "#9B8B6A" }}
                      >
                        {formatVND(product.compare_price)}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Meta info */}
              <div
                className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl p-4 text-sm"
                style={{ background: "#f5f0e8" }}
              >
                <MetaRow
                  label="Tình trạng"
                  value={stock.text}
                  valueColor={stock.color}
                />
                <MetaRow label="Tỉnh / Thành" value={product.province.name} />
                <MetaRow label="Chi nhánh" value={product.location.name} />
                <MetaRow label="Địa chỉ" value={product.location.address} />
              </div>

              {/* CTA */}
              <ContactCTA
                productName={product.name}
                phone={product.location.phone}
              />

              {/* Mô tả */}
              {product.description && (
                <div
                  className="border-t pt-5"
                  style={{ borderColor: "#f0ebe0" }}
                >
                  <p
                    className="mb-2 text-sm font-semibold uppercase tracking-wider"
                    style={{ color: "#9B8B6A" }}
                  >
                    Mô tả sản phẩm
                  </p>
                  <div
                    className="prose prose-sm max-w-none text-sm leading-relaxed"
                    style={{ color: "#4a5568" }}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {related_products.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold" style={{ color: "#3B4E1E" }}>
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {related_products.map((rp) => (
                <RelatedCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function MetaRow({
  label,
  value,
  valueColor = "#3B4E1E",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="text-xs" style={{ color: "#9B8B6A" }}>
        {label}
      </p>
      <p className="font-medium" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

function ContactCTA({
  productName,
  phone,
}: {
  productName: string;
  phone: string;
}) {
  const message = encodeURIComponent(
    `Xin chào! Tôi muốn hỏi thêm về sản phẩm: ${productName}`
  );
  const zaloNumber = phone.replace(/^0/, "84");

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={`https://zalo.me/${zaloNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "#0068FF" }}
      >
        <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.54.69 4.92 1.89 6.97L2 30l7.24-1.87A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 01-5.87-1.6l-.42-.25-4.3 1.11 1.14-4.19-.27-.43A11.56 11.56 0 014.4 16C4.4 9.6 9.6 4.4 16 4.4S27.6 9.6 27.6 16 22.4 27.6 16 27.6z" />
        </svg>
        Liên hệ Zalo
      </a>

      <a
        href={`tel:${phone}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors hover:bg-green-50"
        style={{ borderColor: "#3B4E1E", color: "#3B4E1E" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.66A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
        </svg>
        {phone}
      </a>
    </div>
  );
}

/* RelatedProduct dùng stock (number) → tự tính stock_status */
function RelatedCard({ product }: { product: RelatedProduct }) {
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = stockStatus === "out_of_stock";

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl transition-transform hover:scale-[1.02]"
      style={{
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        opacity: isOutOfStock ? 0.6 : 1,
      }}
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
              sizes="(max-width: 768px) 50vw, 25vw"
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

          {/* Badge hết hàng / sắp hết trên related card */}
          {stockStatus !== "in_stock" && (
            <div className="absolute left-2 top-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                style={{
                  background:
                    stockStatus === "out_of_stock" ? "#9B8B6A" : "#e07b39",
                }}
              >
                {stockStatus === "out_of_stock" ? "Hết hàng" : "Sắp hết"}
              </span>
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
              {product.compare_price && (
                <p
                  className="text-xs line-through"
                  style={{ color: "#9B8B6A" }}
                >
                  {product.compare_price.toLocaleString("vi-VN")} ₫
                </p>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
