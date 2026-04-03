"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLocation } from "@/hooks/useLocation";
import LocationModal from "@/components/location-modal";

function SidebarMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuItems = [
    { label: "Trang chủ", href: "/", icon: "🏠" },
    { label: "Sản phẩm cho Chó", href: "/san-pham-cho-cho", icon: "🐶" },
    { label: "Sản phẩm cho Mèo", href: "/san-pham-cho-meo", icon: "🐱" },
    { label: "Dịch vụ", href: "/dich-vu", icon: "✂️" },
    { label: "Phụ kiện", href: "/phu-kien", icon: "🎀" },
  ];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm transition-opacity duration-350
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-[300px] md:w-[320px] bg-white z-[200] flex flex-col
          shadow-2xl transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b-2 border-orange-100"
          style={{ backgroundColor: "var(--secondary-color)" }}
        >
          <Image
            src="/icons/header-logo.svg"
            alt="WannaPet Logo"
            width={100}
            height={68}
          />
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-200 hover:text-white"
            style={{
              borderColor: "var(--primary-color)",
              color: "var(--primary-color)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--primary-color)";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--primary-color)";
            }}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <p className="px-5 pt-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Danh mục
          </p>
          {menuItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-700
                border-l-[3px] border-transparent transition-all duration-180
                hover:bg-orange-50 hover:border-l-[var(--primary-color)] hover:text-[var(--primary-color)] hover:pl-6
                ${isOpen ? "animate-slideIn" : ""}`}
              style={{
                animationDelay: `${0.05 + i * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <span className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg bg-orange-50 flex-shrink-0">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className="p-4 border-t border-orange-100"
          style={{ backgroundColor: "var(--secondary-color)" }}
        >
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <span className="text-2xl">📞</span>
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

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    locations,
    selectedSlug,
    isModalOpen,
    loading,
    openModal,
    closeModal,
    selectLocation,
  } = useLocation();

  const navItems = [
    { label: "SẢN PHẨM CHO CHÓ", href: "/san-pham-cho-cho" },
    { label: "SẢN PHẨM CHO MÈO", href: "/san-pham-cho-meo" },
    { label: "DỊCH VỤ", href: "/dich-vu" },
    { label: "PHỤ KIỆN", href: "/phu-kien" },
  ];

  return (
    <>
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="w-full bg-[var(--secondary-color)] py-5">
        <div className="xl:max-w-300 mx-auto xl:px-0 px-5">
          <div className="flex items-center gap-5 mb-4">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="cursor-pointer hover:opacity-80 transition-opacity shrink-0 group"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <div className="flex flex-col gap-[5px] w-8">
                <span
                  className={`block h-[3px] rounded-sm bg-[var(--primary-color)] transition-all duration-300 origin-center
                    ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`}
                />
                <span
                  className={`block h-[3px] rounded-sm bg-[var(--primary-color)] transition-all duration-300
                    ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`}
                />
                <span
                  className={`block h-[3px] rounded-sm bg-[var(--primary-color)] transition-all duration-300 origin-center
                    ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </div>
            </button>

            <Link href="/" className="shrink-0">
              <Image
                src="/icons/header-logo.svg"
                alt="WannaPet Logo"
                width={156}
                height={104}
                priority
              />
            </Link>

            <div className="flex-1 max-w-xl relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder=""
                className="w-full rounded-full px-5 py-2 pr-12 text-sm outline-none border-0 bg-white shadow-sm"
                style={{ color: "#555" }}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                aria-label="Search"
              >
                <Image
                  src="/icons/header-search.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </button>
            </div>

            <button
              onClick={openModal}
              className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Chọn khu vực"
            >
              <Image
                src="/icons/header-location.svg"
                alt="Location"
                width={44}
                height={44}
              />
            </button>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Image
                src="/icons/header-phone.svg"
                alt="Phone"
                width={109}
                height={104}
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

          <nav className="hidden md:flex justify-center items-center gap-3">
            <Link
              href="/"
              className="shrink-0 hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <Image
                src="/icons/header-home.svg"
                alt="Home"
                width={44}
                height={44}
              />
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-5 py-2 rounded-full text-white text-sm font-bold text-center hover:opacity-90 active:scale-95 transition-all duration-150"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                {item.label}
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
