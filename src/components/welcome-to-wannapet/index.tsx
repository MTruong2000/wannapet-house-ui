import Image from "next/image";

export default function WelcomeToWannapet() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative mx-auto max-w-6xl px-8 py-14 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 min-w-0 z-10">
          <p
            className="mb-1 text-2xl"
            style={{
              fontFamily: "'Caveat', 'Comic Sans MS', cursive",
              color: "#4a4a3a",
              letterSpacing: "0.02em",
            }}
          >
            Welcome to
          </p>

          <h1
            className="mb-5 font-black leading-none tracking-tight"
            style={{
              fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
              color: "#2d2d1f",
            }}
          >
            wannapet
          </h1>

          <p
            className="mb-8 max-w-md leading-relaxed text-base"
            style={{
              color: "#5a5a48",
              fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
            }}
          >
            <strong style={{ color: "#2d2d1f" }}>wannapet</strong> với hơn 10
            năm kinh nghiệm, cung cấp đầy đủ các sản phẩm và dịch vụ chăm sóc
            thú cưng chất lượng cao. Chúng tôi có đa dạng các loài vật cưng, phụ
            kiện và thức ăn, cùng với đội ngũ nhân viên chuyên nghiệp luôn sẵn
            sàng hỗ trợ khách hàng. Hãy đến{" "}
            <strong style={{ color: "#2d2d1f" }}>wannapet</strong> để khám phá
            thế giới của những người bạn đáng yêu!
          </p>

          <button
            className="bg-[var(--primary-color)] group relative inline-flex items-center gap-2 rounded-full px-7 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            style={{
              fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
              fontSize: "0.95rem",
              boxShadow: "0 4px 15px rgba(156,169,96,0.35)",
            }}
          >
            Tìm hiểu thêm về{" "}
            <span
              className="font-black"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              wannapet
            </span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="relative flex-shrink-0 flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
          <div className="relative w-full aspect-[704/564]">
            <div className="absolute inset-0">
              <Image
                src="/imgs/home-welcome-to-wannapet.webp"
                alt="Welcome to Wannapet – a cat and dog together"
                className="object-cover object-center"
                fill
                priority
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
