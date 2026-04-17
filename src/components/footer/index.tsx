import Image from "next/image";
import Link from "next/link";

export default function WannapetFooter() {
  return (
    <footer className="w-full bg-[#41431B] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-stretch gap-8">
        <div className="flex flex-col items-center justify-center md:w-1/4 gap-3">
          <div className="w-24 h-24  flex items-center justify-center">
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
          </div>

          <div className="text-center">
            <p className="font-light tracking-widest text-xs uppercase">
              Spa · Grooming · Hotel · Food
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs leading-relaxed uppercase tracking-wide">
              Nơi chăm sóc và làm đẹp cho thú cưng của bạn
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center md:w-2/4 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Địa chỉ:</strong> LK1-22 Q7
                Riverside Complex, 4 Đào Trí, Phú Thuận, Quận 7, Tp Hồ Chí Minh
                700000, Việt Nam
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Email:</strong>{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="hover:text-white transition-colors"
                >
                  {process.env.NEXT_PUBLIC_EMAIL}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Hotline:</strong>{" "}
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_SDT}`}
                  className="hover:text-white transition-colors"
                >
                  {process.env.NEXT_PUBLIC_SDT}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </span>
              <span>
                <strong className="font-medium">Website:</strong>{" "}
                <a href="#" className="hover:text-white transition-colors">
                  www.wannapet.vn
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="md:w-1/4 flex items-center justify-center">
          <div className="relative w-60 h-60 md:w-72 md:h-72 overflow-hidden border-4 border-[#f2f2f2]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2904027404347!2d106.6908474!3d10.789055699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f32d7d7e115%3A0xa583ec9d4b2aafef!2zMTAwIMSQaW5oIEPDtG5nIFRyw6FuZywgVMOibiDEkOG7i25oLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1776442840849!5m2!1svi!2s"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wannapet location"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white py-3 px-6">
        <p className="text-center text-white text-xs tracking-wide">
          Copyright © 2024 Wannapet. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
