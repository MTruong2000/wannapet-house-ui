import Image from "next/image";

export default function HomeRegisterSocial() {
  return (
    <section className="w-full flex justify-between bg-[var(--primary-color)]">
      <div className="relative w-[48%] aspect-[3/2] overflow-hidden rounded-tr-[80px] ">
        <Image
          src="/imgs/homepage-resgister-infomation.webp"
          alt="Đăng ký nhận tin"
          fill
          className="object-cover"
        />

        <div className="relative z-10 flex flex-col justify-center h-full px-10 py-12 gap-6">
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-wide text-[var(--primary-color)]">
            Đăng Ký Nhận Tin
          </h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              placeholder="Số điện thoại"
              className="flex-1 px-4 py-2 rounded-full border border-white/60 bg-transparent text-white placeholder-white/70 text-sm outline-none focus:border-white transition"
            />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-4 py-2 rounded-full border border-white/60 bg-transparent text-white placeholder-white/70 text-sm outline-none focus:border-white transition"
            />
          </div>
        </div>
      </div>

      <div className="relative w-[48%] aspect-[3/2] overflow-hidden rounded-tl-[80px]">
        <Image
          src="/imgs/homepage-social.webp"
          alt="Kết nối mạng xã hội"
          fill
          className="object-cover"
        />

        {/* Content */}
        <div className="relative text-center z-10 flex flex-col justify-center h-full px-10 py-12 gap-6">
          <h2 className=" text-3xl font-extrabold uppercase tracking-wide text-[var(--primary-color)]">
            Kết Nối Mạng Xã Hội
          </h2>

          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition backdrop-blur-sm border border-white/30"
              aria-label="TikTok"
            >
              <Image
                src="/icons/icon-tiktok.svg"
                alt="TikTok"
                width={75}
                height={75}
              />
            </a>

            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition backdrop-blur-sm border border-white/30"
              aria-label="Zalo"
            >
              <Image
                src="/icons/icon-zalo.svg"
                alt="Zalo"
                width={75}
                height={75}
              />
            </a>

            <a
              href="#"
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition backdrop-blur-sm border border-white/30"
              aria-label="Facebook"
            >
              <Image
                src="/icons/icon-fb.svg"
                alt="Facebook"
                width={75}
                height={75}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
