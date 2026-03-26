import Link from "next/link";
import Image from "next/image";
const Header = () => {
  return (
    <header className="w-full bg-wannapet-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity">
              <Image
                src="/icons/menu.png"
                alt="Menu Icon"
                width={56}
                height={56}
                className="w-auto h-auto object-contain"
              ></Image>

              <span className="text-wannapet-primary font-extrabold text-sm uppercase">
                Menu
              </span>
            </button>

            <Link
              href="/"
              className="flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              <Image
                src="/image/logo.png"
                alt="Wannapet House Logo"
                width={150}
                height={100}
                className="w-auto h-auto object-contain"
              ></Image>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8 relative">
            <input
              type="text"
              className="w-full h-11 px-6 rounded-full outline-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] text-wannapet-dark bg-white"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-wannapet-primary hover:text-wannapet-dark">
              <Image
                src="/icons/search-icon.png"
                alt="Icon Search"
                width={20}
                height={20}
                className="w-auto h-auto object-contain"
              ></Image>
            </button>
          </div>

          <div className="flex items-center gap-2 text-wannapet-primary">
            <div className="flex-shrink-0">
              <Image
                src="/icons/hotline-icon.png"
                alt="Hot Line Icon"
                width={64}
                height={64}
                className="w-auto h-auto object-contain"
              ></Image>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-sm tracking-wider text-left text-wannapet-primary">
                HOTLINE
              </span>
              <span className="font-extrabold text-xl">0123 456 789</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10 pb-4 justify-center">
          <Link
            href="/"
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Image
              src="/icons/home-icon.png"
              alt="Home logo"
              width={56}
              height={56}
              className="w-auto h-auto object-contain"
            ></Image>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/dog-products"
              className='bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors'
            >
              Sản phẩm cho chó
            </Link>
            <Link
              href="/cat-products"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors"
            >
              Sản phẩm cho mèo
            </Link>
             <Link
              href="/accessories"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors"
            >
              Phụ kiện
            </Link>
            <Link
              href="/services"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors"
            >
              Dịch vụ
            </Link>
            <Link
              href="/about-us"
              className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors"
            >
              Tìm hiểu thêm
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
