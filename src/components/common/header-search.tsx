"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchItem {
  id: string;
  type: "product" | "service";
  name: string;
  slug: string;
  image_url: string | null;
  price: number | null;
  location?: { id: string; name: string; slug: string } | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

function getItemHref(item: SearchItem): string {
  return item.type === "product" ? `san-pham/${item.slug}` : `dich-vu`;
}

function getLocationSlug(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )selected_location_slug=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

interface HeaderSearchProps {
  mobileInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function HeaderSearch({ mobileInputRef }: HeaderSearchProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = mobileInputRef ?? internalInputRef;

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const trimmed = keyword.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const timer = setTimeout(async () => {
      setLoading(true);
      setShowDropdown(true);
      try {
        const query = new URLSearchParams({ keyword: trimmed, limit: "8" });
        const loc = getLocationSlug();
        if (loc) query.set("sku_location", loc);

        const res = await fetch(`${BASE_URL}/api/search?${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message ?? "Search failed");
        if (active) setResults(data.data ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("[HeaderSearch]", err);
          if (active) setResults([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      controller.abort();
      active = false;
    };
  }, [keyword]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      setShowDropdown(false);
      setKeyword("");
      setResults([]);
      router.push(getItemHref(item));
    },
    [router]
  );

  const isDropdownVisible =
    showDropdown && (loading || keyword.trim().length >= 2);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form className="relative">
        <input
          ref={inputRef}
          type="search"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (keyword.trim().length >= 2 || results.length > 0)
              setShowDropdown(true);
          }}
          placeholder="Tìm sản phẩm hoặc dịch vụ..."
          className="w-full rounded-full px-5 py-2.5 pr-12 text-sm outline-none border-0 bg-white shadow-sm text-[#555]"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
          aria-label="Tìm kiếm"
        >
          <Image
            src="/icons/header-search.svg"
            alt=""
            width={20}
            height={20}
            className={`w-5 h-5 ${loading ? "animate-pulse" : ""}`}
            aria-hidden="true"
          />
        </button>
      </form>

      {isDropdownVisible && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl bg-white shadow-xl border border-[#eee] overflow-hidden">
          {loading ? (
            <p className="px-4 py-4 text-sm text-gray-500">Đang tìm kiếm...</p>
          ) : results.length > 0 ? (
            <ul className="max-h-[60vh] overflow-y-auto py-2" role="listbox">
              {results.map((item) => (
                <li
                  key={`${item.type}-${item.id}`}
                  role="option"
                  aria-selected="false"
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#faf7f2] transition-colors"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f8f6f2] ring-1 ring-[#ece7de]">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[#a59b8a] font-medium text-center px-1">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="inline-block mb-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-[#f2eadf] text-[#8b6b3f] uppercase">
                        {item.type === "product" ? "Sản phẩm" : "Dịch vụ"}
                      </span>
                      <p className="text-sm font-semibold text-[#3B4E1E] line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
                        <span>{formatPrice(item.price)}</span>
                        {item.location?.name && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>{item.location.name}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-gray-500">
              Không tìm thấy kết quả phù hợp.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
