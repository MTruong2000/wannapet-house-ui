"use client";

import Image from "next/image";
import Link from "next/link";

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

export default function ProductDetailPageClient({
  data,
}: {
  data: ApiResponse;
}) {
  const { product, related_products } = data;
  const stock = stockLabel(product.stock_status);

  return (
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
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

        <div
          className="mb-10 overflow-hidden rounded-3xl"
          style={{
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}
        >
          <div className="flex flex-col md:flex-row">
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

            <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
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

              <ContactCTA
                productName={product.name}
                phone={product.location.phone}
              />

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
        Liên hệ Zalo
      </a>

      <a
        href={`tel:${phone}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors hover:bg-green-50"
        style={{ borderColor: "#3B4E1E", color: "#3B4E1E" }}
      >
        {phone}
      </a>
    </div>
  );
}

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
