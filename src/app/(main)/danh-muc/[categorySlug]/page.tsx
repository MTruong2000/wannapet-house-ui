import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import CategoryPageClient from "./category-page-client";

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
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
] as const;

type SortValue = (typeof SORT_OPTIONS)[number];

async function getCategoryProducts(params: {
  categorySlug: string;
  locationSlug: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  inStock?: boolean;
  minPrice?: string;
  maxPrice?: string;
}): Promise<ApiResponse> {
  const query = new URLSearchParams({
    sku_location: params.locationSlug,
    sku_category: params.categorySlug,
    search: params.search || "",
    sort: params.sort || "newest",
    page: String(params.page || 1),
    limit: String(params.limit || 12),
    in_stock: String(Boolean(params.inStock)),
  });

  if (params.minPrice) {
    query.set("min_price", params.minPrice);
  }

  if (params.maxPrice) {
    query.set("max_price", params.maxPrice);
  }

  const res = await fetch(`${BASE_URL}/api/products?${query.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res.json();
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    in_stock?: string;
    min_price?: string;
    max_price?: string;
  }>;
}) {
  const { categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  if (!categorySlug) {
    notFound();
  }

  const cookieStore = await cookies();
  const locationSlug = cookieStore.get("selected_location_slug")?.value || "";

  const search = resolvedSearchParams.search || "";
  const sort = SORT_OPTIONS.includes(
    (resolvedSearchParams.sort || "newest") as SortValue
  )
    ? (resolvedSearchParams.sort as SortValue)
    : "newest";

  const page = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);
  const inStock = resolvedSearchParams.in_stock === "true";
  const minPrice = resolvedSearchParams.min_price || "";
  const maxPrice = resolvedSearchParams.max_price || "";
  const limit = 12;

  const pageTitle = categorySlug.replace(/-/g, " ");

  let products: Product[] = [];
  let total = 0;
  let totalPages = 1;
  let error: string | null = null;

  if (!locationSlug) {
    error = "Vui lòng chọn chi nhánh để xem sản phẩm.";
  } else {
    try {
      const result = await getCategoryProducts({
        categorySlug,
        locationSlug,
        search,
        sort,
        page,
        limit,
        inStock,
        minPrice,
        maxPrice,
      });

      products = result.data ?? [];
      total = result.total ?? 0;
      totalPages = result.total_pages ?? 1;
    } catch (err) {
      console.error("Fetch products failed:", err);
      error = "Không thể tải sản phẩm. Vui lòng thử lại.";
    }
  }

  return (
    <CategoryPageClient
      categorySlug={categorySlug}
      pageTitle={pageTitle}
      products={products}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      initialSearch={search}
      initialSort={sort}
      initialInStock={inStock}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
      error={error}
    />
  );
}
