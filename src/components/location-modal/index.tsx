import Image from "next/image";
import { Location } from "@/hooks/useLocation";
import { useEffect, useState } from "react";

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
  const [visible, setVisible] = useState<boolean>(false);
  const [rendered, setRendered] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRendered(false), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 transition-all duration-300
          ${visible ? "bg-black/40 backdrop-blur-sm" : "bg-black/0"}`}
      />

      <div
        className={`relative z-10 rounded-2xl px-6 py-6 w-full max-w-sm mx-4 shadow-2xl
          transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${
            visible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-6"
          }`}
        style={{ backgroundColor: "var(--primary-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex flex-col items-center mb-5 transition-all duration-400
            ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            }`}
          style={{ transitionDelay: visible ? "80ms" : "0ms" }}
        >
          <div
            className={`mb-3 transition-all duration-500
              ${
                visible
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 -rotate-12"
              }`}
            style={{ transitionDelay: visible ? "120ms" : "0ms" }}
          >
            <Image
              src="/icons/header-location.svg"
              alt="Location"
              width={32}
              height={32}
            />
          </div>
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
            {locations.map((loc, i) => (
              <li
                key={loc.id}
                className={`transition-all duration-300
                  ${
                    visible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-6"
                  }`}
                style={{
                  transitionDelay: visible ? `${160 + i * 60}ms` : "0ms",
                }}
              >
                <button
                  onClick={() => onSelect(loc.slug)}
                  className="w-full text-left px-4 py-3 rounded-lg font-semibold text-sm
                    transition-all duration-200 hover:opacity-90 active:scale-[0.98]
                    hover:translate-x-1"
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
