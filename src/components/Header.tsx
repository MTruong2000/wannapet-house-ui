import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full bg-wannapet-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================= */}
        {/* HÀNG TRÊN: Logo - Search - Hotline */}
        {/* ========================================= */}
        <div className="flex justify-between items-center py-4">
          
          {/* Trái: Nút Menu & Logo */}
          <div className="flex items-center gap-6">
            
            {/* 1. Nút Menu */}
            <button className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity">
              <img 
                src="/icons/menu.png" 
                alt="Menu" 
                className="w-10 h-8 object-contain" 
              />
              <span className="text-wannapet-dark font-extrabold text-sm uppercase">
                Menu
              </span>
            </button>

            {/* 2. Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
              <img 
                src="/images/wannapet-logo.png" 
                alt="Wannapet House Logo" 
                className="h-16 w-auto object-contain" 
              />
            </Link>
            
          </div>

          {/* Giữa: Thanh tìm kiếm */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <input 
              type="text" 
              className="w-full h-11 px-6 rounded-full outline-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] text-wannapet-dark bg-white"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-wannapet-primary hover:text-wannapet-dark">
              <img 
                src="/icons/search-icon.png" 
                alt="Icon Search" 
                className="h-5 w-auto object-contain" 
              />
            </button>
          </div>

          {/* Phải: Hotline */}
          <div className="flex items-center gap-2 text-wannapet-primary">
            <div className="text-4xl">
                <img 
                src="/icons/hotline-icon.png" 
                alt="Hot Line Icon" 
                className="h-16 w-auto object-contain" 
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-sm tracking-wider text-left text-wannapet-primary">HOTLINE</span>
              <span className="font-extrabold text-xl">0123 456 789</span>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* HÀNG DƯỚI: Nút Home & Các nút Menu chữ */}
        {/* ========================================= */}
        <div className="flex items-center gap-10 pb-4 justify-center">
          
          {/* Icon Home */}
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="/icons/home-icon.png" 
              alt="Home logo" 
              className="h-14 w-auto object-contain" 
            />
          </Link>

          {/* Danh sách các nút sử dụng Link của Next.js */}
          <nav className="flex items-center gap-3">
            <Link href="/" className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors">
              Sản phẩm cho chó
            </Link>
            <Link href="/" className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors">
              Sản phẩm cho mèo
            </Link>
            <Link href="/" className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors">
              Dịch vụ
            </Link>
            <Link href="/" className="bg-wannapet-primary text-white font-bold text-sm uppercase px-6 py-3 rounded-full hover:bg-wannapet-dark transition-colors">
              Phụ kiện
            </Link>
          </nav>
          
        </div>

      </div>
    </header>
  );
};

export default Header;