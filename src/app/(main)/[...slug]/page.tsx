import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import DynamicCategoryPageClient from "./dynamic-category-page-client";

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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArr = resolvedParams.slug;
  const slug = slugArr?.length === 1 ? slugArr[0] : null;

  const pageInfo = slug ? VALID_PAGES[slug] : null;

  if (!slug || !pageInfo) {
    return {};
  }

  const title = pageInfo.label;
  const description = `${pageInfo.label} tại Wannapet House. ${pageInfo.description}. Khám phá nhiều sản phẩm chất lượng dành cho thú cưng.`;
  const canonical = `/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/${slug}`,
      images: [
        {
          url: "/hoa.jpg",
          width: 1200,
          height: 630,
          alt: pageInfo.label,
        },
      ],
    },
  };
}

async function getProductsByCategory(
  slug: string,
  locationSlug: string
): Promise<CategoryBlock[]> {
  if (!locationSlug) return [];

  const url = `${BASE_URL}/api/products-by-category?sku_location=${encodeURIComponent(
    locationSlug
  )}&sku_category=${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export default async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const slugArr = resolvedParams.slug;
  const slug = slugArr?.length === 1 ? slugArr[0] : null;

  const pageInfo = slug ? VALID_PAGES[slug] : null;
  if (!pageInfo || !slug) {
    notFound();
  }

  const cookieStore = await cookies();
  const locationSlug = cookieStore.get("selected_location_slug")?.value || "";

  let blocks: CategoryBlock[] = [];
  let error: string | null = null;

  if (!locationSlug) {
    error = "Vui lòng chọn chi nhánh để xem sản phẩm.";
  } else {
    try {
      blocks = await getProductsByCategory(slug, locationSlug);
    } catch (err) {
      console.error("Failed to fetch category products:", err);
      error = "Không thể tải sản phẩm. Vui lòng thử lại.";
    }
  }

  return (
    <DynamicCategoryPageClient
      pageInfo={pageInfo}
      blocks={blocks}
      error={error}
    />
  );
}
