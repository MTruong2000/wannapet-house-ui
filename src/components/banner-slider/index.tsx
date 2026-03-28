"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const banners = [
  { src: "/imgs/banner-01.webp", alt: "Banner 01 - Wannapet" },
  { src: "/imgs/banner-02.webp", alt: "Banner 02 - Wannapet" },
  { src: "/imgs/banner-03.webp", alt: "Banner 03 - Wannapet" },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [isTransitioning]
  );

  const prev = useCallback(() => {
    goTo((current - 1 + banners.length) % banners.length);
  }, [current, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative w-full overflow-hidden group">
      <div className="relative w-full aspect-[1294/464]">
        {banners.map((banner, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            }`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous banner"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 hover:bg-white hover:scale-110 text-gray-700"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={next}
        aria-label="Next banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 hover:bg-white hover:scale-110 text-gray-700"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to banner ${i + 1}`}
            className={`
              transition-all duration-400 rounded-full
              ${
                i === current
                  ? "w-6 h-2.5 bg-white shadow-md"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }
            `}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 z-30">
        <div
          key={current}
          className="h-full bg-white/70 rounded-full animate-progress-bar"
        />
      </div>
    </div>
  );
}
