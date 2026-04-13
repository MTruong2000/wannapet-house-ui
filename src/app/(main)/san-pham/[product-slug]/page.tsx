import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductDetailPageClient from "./product-detail-page-client";

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

async function getProductDetail(
  productSlug: string,
  locationSlug: string
): Promise<ApiResponse | null> {
  const query = new URLSearchParams({ sku: productSlug });

  if (locationSlug) {
    query.set("sku_location", locationSlug);
  }

  query.set("include_related", "true");
  query.set("related_limit", "8");

  const res = await fetch(
    `${BASE_URL}/api/product-detail?${query.toString()}`,
    {
      next: { revalidate: 300 },
    }
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ "product-slug": string }>;
}) {
  const resolvedParams = await params;
  const productSlug = resolvedParams["product-slug"];

  if (!productSlug) {
    notFound();
  }

  const cookieStore = await cookies();
  const locationSlug = cookieStore.get("selected_location_slug")?.value || "";

  let data: ApiResponse | null = null;

  try {
    data = await getProductDetail(productSlug, locationSlug);
  } catch (error) {
    console.error("Fetch product detail failed:", error);
    data = null;
  }

  if (!data) {
    notFound();
  }

  return <ProductDetailPageClient data={data} />;
}
