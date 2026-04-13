import { Product } from "./type";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getRecentProducts(
  skuCategory: string,
  locationSlug: string
): Promise<Product[]> {
  if (!locationSlug) return [];

  const res = await fetch(
    `${BASE_URL}/api/recent-products?sku_location=${locationSlug}&sku_category=${skuCategory}`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
