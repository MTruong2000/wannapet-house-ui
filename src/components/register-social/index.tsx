import Image from "next/image";

export default function HomeRegisterSocial() {
  return (
    <section className="w-full bg-[var(--primary-color)]">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="relative w-full md:w-[49%] aspect-[3/2] overflow-hidden rounded-tr-[120px] md:rounded-tr-[200px]">
          <Image
            src="/imgs/homepage-resgister-infomation.webp"
            alt="Đăng ký nhận tin"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/50 z-[1]" />

          <div className="relative z-10 flex h-full flex-col justify-center px-4 py-8 sm:px-6 md:px-10 md:py-12 gap-4 md:gap-6">
            <h2
              className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-[var(--primary-color)]"
              style={{
                WebkitTextStroke: "1px #f5f1d8",
                textShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}
            >
              Đăng Ký Nhận Tin
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="h-11 flex-1 rounded-full border border-white/60 bg-transparent py-1.5 md:py-0 px-4 text-sm text-white placeholder-white/70 outline-none transition focus:border-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="h-11 flex-1 rounded-full border border-white/60 bg-transparent py-1.5 md:py-0 px-4 text-sm text-white placeholder-white/70 outline-none transition focus:border-white"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="w-full rounded-full border border-[#f5f1d8] bg-[#f5f1d8] py-1 md:py-2 text-sm font-bold uppercase tracking-wide text-[#4f561f] transition hover:opacity-90"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-[48%] aspect-[3/2] overflow-hidden rounded-tl-[120px] md:rounded-tl-[200px]">
          <Image
            src="/imgs/homepage-social.webp"
            alt="Kết nối mạng xã hội"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/50 z-[1]" />

          <div className="relative z-10 flex h-full flex-col justify-center px-4 py-8 text-center sm:px-6 md:px-10 md:py-12 gap-4 md:gap-6">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-[var(--primary-color)]"
              style={{
                WebkitTextStroke: "1px #f5f1d8",
                textShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}
            >
              Kết Nối Mạng Xã Hội
            </h2>

            <div className="flex justify-center gap-3 sm:gap-4">
              <a
                href="#"
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition hover:bg-white/20"
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
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition hover:bg-white/20"
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
                className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm transition hover:bg-white/20"
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
      </div>
    </section>
  );
}
