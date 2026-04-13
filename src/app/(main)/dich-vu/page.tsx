import { cookies } from "next/headers";
import ServicesPageClient from "./services-page-client";

interface ServiceFeature {
  id: string;
  title: string;
  sort_order: number;
}

interface ServiceLocation {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number | null;
  image_url: string | null;
  created_at: string;
  location: ServiceLocation;
  features: ServiceFeature[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Service[];
  pagination: Pagination;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LIMIT = 10;

async function getServices(
  locationSlug: string,
  page: number
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    sku_location: locationSlug,
    page: String(page),
    limit: String(LIMIT),
  });

  const res = await fetch(`${BASE_URL}/api/services?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);

  const cookieStore = await cookies();
  const locationSlug = cookieStore.get("selected_location_slug")?.value || "";

  let services: Service[] = [];
  let pagination: Pagination | null = null;
  let error: string | null = null;

  if (!locationSlug) {
    error = "Vui lòng chọn chi nhánh để xem dịch vụ.";
  } else {
    try {
      const json = await getServices(locationSlug, page);
      services = json.data ?? [];
      pagination = json.pagination ?? null;
    } catch (err) {
      console.error("Fetch services failed:", err);
      error = "Không thể tải dịch vụ. Vui lòng thử lại.";
    }
  }

  return (
    <ServicesPageClient
      services={services}
      pagination={pagination}
      error={error}
    />
  );
}
