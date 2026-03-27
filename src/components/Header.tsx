"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <>
      <header className="w-full bg-wannapet-cream">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-2 sm:py-3 md:py-4 gap-2 md:gap-4 relative">
            <div className="flex items-center md:justify-start gap-2 sm:gap-3 md:gap-6">
              <button
                className="flex flex-col items-center justify-center gap-0.5 hover:opacity-80 transition-opacity"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Image
                  src="/icons/menu.png"
                  alt="Menu Icon"
                  width={56}
                  height={56}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                />
                <span className="text-wannapet-primary font-extrabold text-xs sm:text-sm uppercase">
                  Menu
                </span>
              </button>

              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex-shrink-0 hover:opacity-90 transition-opacity"
              >
                <Image
                  src="/images/wannapet-logo.png"
                  alt="Wannapet House Logo"
                  width={150}
                  height={100}
                  className="w-20 h-auto sm:w-24 md:w-32 lg:w-40 object-contain"
                />
              </Link>
            </div>

            <div className="hidden md:block order-last w-full md:order-none md:flex-1 max-w-sm md:max-w-2xl md:mx-4 lg:mx-8 relative mt-2 md:mt-0">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6 rounded-full outline-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] text-wannapet-dark bg-white text-xs sm:text-sm"
              />
              <button className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-wannapet-primary hover:text-wannapet-dark">
                <Image
                  src="/icons/search-icon.png"
                  alt="Icon Search"
                  width={20}
                  height={20}
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 object-contain"
                />
              </button>
            </div>
            <button
              className="block md:hidden text-wannapet-primary hover:text-wannapet-dark p-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Image
                src="/icons/search-icon.png"
                alt="Icon Search Mobile"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              />
            </button>

            <div className="hidden sm:flex items-center gap-1 md:gap-2 text-wannapet-primary flex-shrink-0">
              <div className="flex-shrink-0">
                <Image
                  src="/icons/hotline-icon.png"
                  alt="Hot Line Icon"
                  width={64}
                  height={64}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs sm:text-sm md:text-base tracking-wider text-wannapet-primary">
                  HOTLINE
                </span>
                <span className="font-extrabold text-xs sm:text-sm md:text-xl">
                  0123 456 789
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-10 pb-2 sm:pb-3 md:pb-4 justify-center flex-wrap">
            <Link
              href="/"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src="/icons/home-icon.png"
                alt="Home logo"
                width={56}
                height={56}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
              />
            </Link>

            <nav className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-wrap">
              <Link
                href="/"
                className="bg-wannapet-primary text-white font-bold text-xs sm:text-xs md:text-sm uppercase px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-wannapet-dark transition-colors whitespace-nowrap"
              >
                Sản phẩm chó
              </Link>
              <Link
                href="/"
                className="bg-wannapet-primary text-white font-bold text-xs sm:text-xs md:text-sm uppercase px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-wannapet-dark transition-colors whitespace-nowrap"
              >
                Sản phẩm mèo
              </Link>
              <Link
                href="/"
                className="bg-wannapet-primary text-white font-bold text-xs sm:text-xs md:text-sm uppercase px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-wannapet-dark transition-colors whitespace-nowrap"
              >
                Dịch vụ
              </Link>
              <Link
                href="/"
                className="bg-wannapet-primary text-white font-bold text-xs sm:text-xs md:text-sm uppercase px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-wannapet-dark transition-colors whitespace-nowrap"
              >
                Phụ kiện
              </Link>
            </nav>
          </div>
          {isSearchOpen && (
            <div className="bg-transparent md:hidden w-full px-4 pb-4 transition-all duration-300">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Nhập từ khoá cần tìm..."
                  className="w-full h-10 px-4 rounded-full outline-none shadow-sm border border-gray-200 text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </header>
      <div className={`md:hidden ${isDrawerOpen ? "visible" : "invisible"}`}>
        <div
          onClick={() => setIsDrawerOpen(false)}
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
        ></div>

        <div
          className={`fixed top-0 left-0 w-[280px] h-full bg-wannapet-cream z-50 p-6 flex flex-col gap-6 shadow-xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-end">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-wannapet-primary text-2xl font-bold p-2"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full text-center"
            >
              Sản phẩm cho chó
            </Link>
          </nav>
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full text-center"
            >
              Sản phẩm cho mèo
            </Link>
          </nav>
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full text-center"
            >
              Dịch vụ
            </Link>
          </nav>
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full text-center"
            >
              Phụ kiện
            </Link>
          </nav>

          <div className="flex flex-col items-center gap-2 mt-auto text-wannapet-primary border-t border-gray-200 pt-6">
            <Image
              src="/icons/hotline-icon.png"
              alt="Hotline"
              width={50}
              height={50}
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-xs tracking-wider">HOTLINE</span>
            <span className="font-extrabold text-lg">0123 456 789</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
