"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/lib/type";

interface PetProductSectionClientProps {
  products: Product[];
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

export default function PetProductSectionClient({
  products,
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
}: PetProductSectionClientProps) {
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

  return (
    <section ref={sectionRef} className="w-full bg-[var(--primary-color)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-12">
        <div
          className={`relative flex justify-center items-center gap-6 md:gap-10 flex-col ${
            petImagePosition === "right" ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <div
            className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[286px] mx-auto md:mx-0 flex-shrink-0"
            style={{
              transition: visible
                ? "opacity 0.7s ease, transform 0.7s ease"
                : "none",
              opacity: visible ? 1 : 0,
              transform: visible
                ? "translateX(0)"
                : petImagePosition === "left"
                ? "translateX(-32px)"
                : "translateX(32px)",
            }}
          >
            <div className="relative w-full aspect-[286/367]">
              <div className="absolute inset-0 translate-x-[10px] translate-y-[10px] sm:translate-x-3 sm:translate-y-3 border-[4px] border-[#CEE672] rounded-2xl z-0" />
              <div className="absolute inset-0 overflow-hidden rounded-2xl z-[1]">
                <Image
                  src={petImageSrc}
                  alt={petImageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col min-w-0 w-full md:w-auto md:min-w-[700px]">
            <div
              className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap text-center"
              style={{
                transition: visible
                  ? "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s"
                  : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(-16px)",
              }}
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src={foodIconSrc}
                  alt="Food"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="relative w-[150px] h-[36px] sm:w-[180px] sm:h-[42px] md:w-[220px] md:h-[52px] flex-shrink-0">
                <Image
                  src={titleSvgSrc}
                  alt={titleSvgAlt}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                <Image
                  src={petIconSrc}
                  alt={petIconAlt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3 sm:gap-4 overflow-x-auto md:overflow-visible pb-2 px-1 md:px-0 justify-start md:justify-center">
              {products.map((product, index) => (
                <Link
                  key={`${product.slug}-${index}`}
                  href={`/san-pham/${product.slug}`}
                  className="flex-shrink-0 rounded-2xl overflow-hidden relative cursor-pointer hover:scale-[1.03] w-[150px] h-[210px] sm:w-[180px] sm:h-[240px] md:w-[217px] md:h-[285px]"
                  style={{
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
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 217px"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 py-2"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                        }}
                      >
                        <p className="text-white text-[11px] sm:text-xs font-medium text-center leading-tight line-clamp-2">
                          {product.name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-end p-3"
                      style={{ background: "#F8F3E1" }}
                    >
                      <p
                        className="text-[11px] sm:text-xs text-center line-clamp-3 leading-snug"
                        style={{ color: "#9B8B6A" }}
                      >
                        {product.name}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div
              className="flex justify-center mt-5 sm:mt-6"
              style={{
                transition: visible
                  ? "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s"
                  : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {viewMoreHref ? (
                <Link href={viewMoreHref}>
                  <button className="text-white text-sm sm:text-base font-semibold rounded-full bg-[#3B4E1E] px-8 py-2.5 cursor-pointer">
                    Xem thêm
                  </button>
                </Link>
              ) : (
                <button
                  onClick={onViewMore}
                  className="text-white text-sm sm:text-base font-semibold rounded-full bg-[#3B4E1E] px-8 py-2.5 cursor-pointer"
                >
                  Xem thêm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
