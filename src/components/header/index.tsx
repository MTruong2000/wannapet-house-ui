"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import HeaderSearch from "../common/header-search";
import LocationModal from "@/components/location-modal";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/", icon: "🏠" },
  { label: "Sản phẩm cho Chó", href: "/san-pham-cho-cho", icon: "🐶" },
  { label: "Sản phẩm cho Mèo", href: "/san-pham-cho-meo", icon: "🐱" },
  { label: "Dịch vụ", href: "/dich-vu", icon: "✂️" },
  { label: "Phụ kiện", href: "/phu-kien", icon: "🎀" },
];

const DESKTOP_NAV = NAV_ITEMS.slice(1);

function SidebarMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm transition-opacity duration-300
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-white z-[200] flex flex-col
          shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b-2 border-orange-100 shrink-0"
          style={{ backgroundColor: "var(--secondary-color)" }}
        >
          <Image
            src="/icons/header-logo.svg"
            alt="WannaPet"
            width={100}
            height={68}
          />
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg transition-colors"
            style={{
              borderColor: "var(--primary-color)",
              color: "var(--primary-color)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary-color)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--primary-color)";
            }}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3" aria-label="Menu chính">
          <p className="px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Danh mục
          </p>
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-700
                border-l-[3px] border-transparent transition-all duration-150
                hover:bg-orange-50 hover:border-l-[var(--primary-color)] hover:text-[var(--primary-color)] hover:pl-6
                ${isOpen ? "animate-slideIn" : ""}`}
              style={{
                animationDelay: `${0.05 + i * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <span className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg bg-orange-50 shrink-0">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="p-4 border-t border-orange-100 shrink-0"
          style={{ backgroundColor: "var(--secondary-color)" }}
        >
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <span className="text-2xl" aria-hidden="true">
              📞
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-white/80 uppercase">
                Hotline hỗ trợ
              </p>
              <p className="text-base font-bold text-white">0123 456 789</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 p-1 hover:opacity-80 transition-opacity"
      aria-label={isOpen ? "Đóng menu" : "Mở menu"}
      aria-expanded={isOpen}
      aria-controls="sidebar-menu"
    >
      <div className="flex flex-col gap-[5px] w-7">
        {[
          isOpen ? "translate-y-[8px] rotate-45" : "",
          isOpen ? "opacity-0 scale-x-0" : "",
          isOpen ? "-translate-y-[8px] -rotate-45" : "",
        ].map((cls, i) => (
          <span
            key={i}
            className={`block h-[3px] rounded-sm bg-[var(--primary-color)] transition-all duration-300 origin-center ${cls}`}
          />
        ))}
      </div>
    </button>
  );
}

function MobileSearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex flex-col transition-opacity duration-200
        ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    >
      <div
        className={`w-full transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ backgroundColor: "var(--secondary-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <HeaderSearch mobileInputRef={inputRef} />
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-sm font-semibold py-1 px-3 rounded-full"
            style={{ color: "var(--primary-color)" }}
          >
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const {
    locations,
    selectedSlug,
    isModalOpen,
    loading,
    openModal,
    closeModal,
    selectLocation,
  } = useLocation();

  return (
    <>
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

      <header className="w-full bg-[var(--secondary-color)] py-3 md:py-5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 xl:px-0">
          <div className="flex items-center gap-3 md:gap-5">
            <HamburgerButton
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            />

            <Link
              href="/"
              className="shrink-0"
              aria-label="WannaPet - Trang chủ"
            >
              <Image
                src="/icons/header-logo.svg"
                alt="WannaPet"
                width={120}
                height={80}
                priority
                className="w-24 h-auto md:w-[156px]"
              />
            </Link>

            <div className="hidden md:block flex-1 max-w-xl">
              <HeaderSearch />
            </div>

            <div className="flex-1 md:hidden" />

            <button
              className="md:hidden shrink-0 p-2 rounded-full hover:bg-orange-100 transition-colors"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Tìm kiếm"
            >
              <Image
                src="/icons/header-search.svg"
                alt=""
                width={22}
                height={22}
                aria-hidden="true"
              />
            </button>

            <button
              onClick={openModal}
              className="shrink-0 p-1 hover:opacity-80 transition-opacity"
              aria-label="Chọn khu vực"
            >
              <Image
                src="/icons/header-location.svg"
                alt="Khu vực"
                width={40}
                height={40}
                className="w-9 h-9 md:w-11 md:h-11"
              />
            </button>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Image
                src="/icons/header-phone.svg"
                alt=""
                width={40}
                height={40}
                aria-hidden="true"
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-xs font-bold tracking-wider"
                  style={{ color: "var(--primary-color)" }}
                >
                  HOTLINE
                </span>
                <span
                  className="text-base font-bold"
                  style={{ color: "var(--primary-color)" }}
                >
                  0123 456 789
                </span>
              </div>
            </div>
          </div>

          <nav
            className="hidden md:flex justify-center items-center gap-3 mt-4"
            aria-label="Danh mục"
          >
            <Link
              href="/"
              className="shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Trang chủ"
            >
              <Image
                src="/icons/header-home.svg"
                alt="Trang chủ"
                width={44}
                height={44}
              />
            </Link>
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2 rounded-full text-white text-sm font-bold text-center hover:opacity-90 active:scale-95 transition-all duration-150"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <LocationModal
        isOpen={isModalOpen}
        locations={locations}
        selectedSlug={selectedSlug}
        loading={loading}
        onSelect={selectLocation}
        onClose={closeModal}
      />
    </>
  );
}
