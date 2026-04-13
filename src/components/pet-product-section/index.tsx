import { cookies } from "next/headers";

import { getRecentProducts } from "@/lib/api";
import PetProductSectionClient from "./pet-product-section-client";

interface PetProductSectionProps {
  skuCategory: string;
  petImageSrc: string;
  petImageAlt: string;
  foodIconSrc: string;
  titleSvgSrc: string;
  titleSvgAlt: string;
  petIconSrc: string;
  petIconAlt: string;
  petImagePosition?: "left" | "right";
  viewMoreHref?: string;
  onViewMore?: () => void;
}

export default async function PetProductSection(props: PetProductSectionProps) {
  const cookieStore = await cookies();
  const locationSlug = cookieStore.get("selected_location_slug")?.value || "";

  const products = await getRecentProducts(props.skuCategory, locationSlug);

  return <PetProductSectionClient {...props} products={products} />;
}
