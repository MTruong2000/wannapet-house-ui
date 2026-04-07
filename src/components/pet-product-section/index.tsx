"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  sku: string;
  image_url: string | null;
}

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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function PetProductSection({
  skuCategory,
  petImageSrc,
  petImageAlt,
  foodIconSrc,
  titleSvgSrc,
  titleSvgAlt,
  petIconSrc,
  petIconAlt,
  petImagePosition = "left",
  viewMoreHref,
  onViewMore,
}: PetProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const locationSlug = localStorage.getItem("selected_location_slug") || "";
    const url = `${BASE_URL}/api/recent-products?sku_location=${locationSlug}&sku_category=${skuCategory}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, [skuCategory]);

  const petImageBlock = (
    <div
      className="flex-shrink-0 self-end"
      style={{
        width: 286,
        height: 367,
        position: "relative",
        transition: visible ? "opacity 0.7s ease, transform 0.7s ease" : "none",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : petImagePosition === "left"
          ? "translateX(-32px)"
          : "translateX(32px)",
      }}
    >
      <div
        className="absolute rounded-2xl"
        style={{
          width: 286,
          height: 367,
          top: 12,
          left: 12,
          border: "4px solid #CEE672",
          borderRadius: 16,
          zIndex: 0,
        }}
      />
      <div
        className="absolute top-0 left-0 overflow-hidden"
        style={{ width: 286, height: 367, borderRadius: 16, zIndex: 1 }}
      >
        <Image
          src={petImageSrc}
          alt={petImageAlt}
          width={286}
          height={367}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          priority
        />
      </div>
    </div>
  );

  const productsBlock = (
    <div className="flex flex-col min-w-0">
      <div
        className="flex items-center justify-center gap-4"
        style={{
          transition: visible
            ? "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s"
            : "none",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-16px)",
        }}
      >
        <div
          style={{ width: 48, height: 48, position: "relative", flexShrink: 0 }}
        >
          <Image
            src={foodIconSrc}
            alt="Food"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: 220,
            height: 52,
            flexShrink: 0,
          }}
        >
          <Image
            src={titleSvgSrc}
            alt={titleSvgAlt}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          style={{ width: 64, height: 64, position: "relative", flexShrink: 0 }}
        >
          <Image
            src={petIconSrc}
            alt={petIconAlt}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 animate-pulse bg-[#F8F3E1] rounded-2xl"
              style={{ width: 217, height: 285 }}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto p-3">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-shrink-0 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.03]"
              style={{
                width: 217,
                height: 285,
                transition: visible
                  ? `opacity 0.6s ease ${
                      0.2 + index * 0.1
                    }s, transform 0.6s ease ${
                      0.2 + index * 0.1
                    }s, scale 0.2s ease`
                  : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {product.image_url ? (
                <>
                  <Image
                    src={product.image_url}
                    alt={product.sku}
                    width={217}
                    height={285}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                    }}
                  >
                    <p className="text-white text-xs font-medium text-center leading-tight line-clamp-2">
                      {product.sku}
                    </p>
                  </div>
                </>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-end p-3"
                  style={{ background: "#F8F3E1" }}
                >
                  <p
                    className="text-xs text-center line-clamp-3 leading-snug"
                    style={{ color: "#9B8B6A" }}
                  >
                    {product.sku}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        className="flex justify-center"
        style={{
          marginTop: "auto",
          transition: visible
            ? "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s"
            : "none",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {viewMoreHref ? (
          <Link href={viewMoreHref}>
            <ViewMoreButton />
          </Link>
        ) : (
          <ViewMoreButton onClick={onViewMore} />
        )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full">
      <div
        className="relative w-full bg-[var(--primary-color)] flex flex-row justify-center items-stretch gap-6 p-16 pt-0"
        style={{ minHeight: 410 }}
      >
        {petImagePosition === "left" ? (
          <>
            {petImageBlock}
            {productsBlock}
          </>
        ) : (
          <>
            {productsBlock}
            {petImageBlock}
          </>
        )}
      </div>
    </section>
  );
}

function ViewMoreButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-white text-sm font-semibold rounded-full"
      style={{
        background: "#3B4E1E",
        padding: "10px 48px",
        transition: "background 0.2s ease, transform 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#2e3e16";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#3B4E1E";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      Xem thêm
    </button>
  );
}
