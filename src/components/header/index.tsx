"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLocation } from "@/hooks/useLocation";

import LocationModal from "@/components/location-modal";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
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
    { label: "SẢN PHẨM CHO CHÓ", href: "#" },
    { label: "SẢN PHẨM CHO MÈO", href: "#" },
    { label: "DỊCH VỤ", href: "#" },
    { label: "PHỤ KIỆN", href: "#" },
  ];

  return (
    <>
      <header className="w-full bg-[var(--secondary-color)] py-5">
        <div className="xl:max-w-300 mx-auto xl:px-0 px-5">
          <div className="flex items-center gap-5 mb-4">
            <button
              className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              aria-label="Menu"
            >
              <Image
                src="/icons/header-menu.svg"
                alt="Menu"
                width={81}
                height={93}
              />
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

            <div className="flex items-center gap-2 shrink-0">
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

          <nav className="flex justify-center items-center gap-3">
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
