"use client";

import Image from "next/image";
import { Location } from "@/hooks/useLocation";

interface LocationModalProps {
  isOpen: boolean;
  locations: Location[];
  selectedSlug: string | null;
  loading: boolean;
  onSelect: (slug: string) => void;
  onClose: () => void;
}

export default function LocationModal({
  isOpen,
  locations,
  selectedSlug,
  loading,
  onSelect,
  onClose,
}: LocationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />

      <div
        className="relative z-10 rounded-2xl px-6 py-6 w-full max-w-sm mx-4 shadow-2xl"
        style={{ backgroundColor: "var(--primary-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-5">
          <Image
            src="/icons/header-location.svg"
            alt="Location"
            width={32}
            height={32}
            className="mb-3"
          />
          <h2 className="text-white font-bold text-base text-center uppercase tracking-wide">
            Chọn nơi khu vực phù hợp cho bạn
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-white py-4 text-sm opacity-80">
            Đang tải...
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {locations.map((loc) => (
              <li key={loc.id}>
                <button
                  onClick={() => onSelect(loc.slug)}
                  className="w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
                  style={{
                    backgroundColor:
                      selectedSlug === loc.slug
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(255,255,255,0.15)",
                    color: "white",
                    border:
                      selectedSlug === loc.slug
                        ? "2px solid rgba(255,255,255,0.7)"
                        : "2px solid transparent",
                  }}
                >
                  {loc.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
