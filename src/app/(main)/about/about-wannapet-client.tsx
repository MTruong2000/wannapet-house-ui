"use client";

import { useEffect, useRef, useState } from "react";

interface ContentBlockItem {
  label: string;
  content: string;
  icon?: string;
}

interface ContentBlock {
  id: string;
  block_key: string;
  title: string;
  intro: string | null;
  items: ContentBlockItem[];
  location_id: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, mounted, visible };
}

function getItemIcon(index: number) {
  const icons = ["🐾", "🦴", "🧸", "✂️", "💬", "🏠", "🛁", "🦮"];
  return icons[index % icons.length];
}

function StatCounter({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) {
  const { ref, mounted, visible } = useReveal();
  const show = !mounted || visible;

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: mounted
          ? `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
          : "none",
      }}
    >
      <div
        className="mb-1 text-3xl font-black sm:text-4xl md:text-5xl"
        style={{
          fontFamily: "'Nunito', sans-serif",
          color: "var(--primary-color, #9ca960)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      <div
        className="text-[10px] uppercase tracking-[0.18em] sm:text-xs"
        style={{ color: "#7a7a60", fontFamily: "'Nunito', sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

function ServiceCard({
  item,
  index,
}: {
  item: ContentBlockItem;
  index: number;
}) {
  const { ref, mounted, visible } = useReveal();
  const show = !mounted || visible;

  return (
    <div
      ref={ref}
      className="group relative cursor-default rounded-2xl p-4 sm:p-5 md:p-6"
      style={{
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(156,169,96,0.2)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        opacity: show ? 1 : 0,
        transform: show
          ? "translateY(0) scale(1)"
          : "translateY(24px) scale(0.98)",
        transition: mounted
          ? `opacity 0.55s ease ${index * 80}ms, transform 0.55s ease ${
              index * 80
            }ms, box-shadow 0.3s ease`
          : "none",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(156,169,96,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex items-start gap-3 sm:gap-4">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl sm:h-12 sm:w-12 sm:text-2xl"
          style={{ background: "rgba(156,169,96,0.15)" }}
        >
          {item.icon || getItemIcon(index)}
        </div>

        <div className="min-w-0">
          <h3
            className="mb-1 text-[15px] font-bold leading-snug sm:text-base"
            style={{
              color: "#2d2d1f",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {item.label}
          </h3>

          <p
            className="text-sm leading-6 sm:text-[15px]"
            style={{ color: "#6a6a52", fontFamily: "'Nunito', sans-serif" }}
          >
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  delay,
}: {
  eyebrow: string;
  title: string;
  delay: number;
}) {
  const { ref, mounted, visible } = useReveal();
  const show = !mounted || visible;

  return (
    <div
      ref={ref}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: mounted
          ? `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
          : "none",
      }}
    >
      <p
        className="mb-1 text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
        style={{
          color: "var(--primary-color, #9ca960)",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {eyebrow}
      </p>

      <h2
        className="text-2xl font-black leading-tight sm:text-3xl"
        style={{ color: "#2d2d1f", fontFamily: "'Nunito', sans-serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function AboutWannapetClient({ data }: { data: ContentBlock }) {
  const heroReveal = useReveal();
  const introReveal = useReveal();

  const heroShow = !heroReveal.mounted || heroReveal.visible;
  const introShow = !introReveal.mounted || introReveal.visible;

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #f9f8f2 0%, #f0ede0 50%, #e8e4d0 100%)",
        fontFamily: "'Nunito', 'Trebuchet MS', sans-serif",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />

      <section className="relative px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
        <div
          className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full opacity-20 sm:h-80 sm:w-80 md:h-96 md:w-96"
          style={{
            background: "radial-gradient(circle, #9ca960 0%, transparent 70%)",
            transform: "translate(28%, -28%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full opacity-15 sm:h-56 sm:w-56 md:h-64 md:w-64"
          style={{
            background: "radial-gradient(circle, #c4b87a 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />

        <div
          // eslint-disable-next-line react-hooks/refs
          ref={heroReveal.ref}
          className="relative mx-auto max-w-3xl text-center"
        >
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold sm:mb-6 sm:px-4 sm:text-sm"
            style={{
              background: "rgba(156,169,96,0.15)",
              color: "#6a7a30",
              border: "1px solid rgba(156,169,96,0.3)",
              opacity: heroShow ? 1 : 0,
              transform: heroShow ? "translateY(0)" : "translateY(16px)",
              // eslint-disable-next-line react-hooks/refs
              transition: heroReveal.mounted
                ? "opacity 0.6s ease 0ms, transform 0.6s ease 0ms"
                : "none",
            }}
          >
            <span>🐾</span> Giới thiệu
          </div>

          <h1
            className="mb-4 font-black leading-[0.95]"
            style={{
              fontSize: "clamp(2.2rem, 9vw, 6rem)",
              color: "#2d2d1f",
              letterSpacing: "-0.02em",
              opacity: heroShow ? 1 : 0,
              transform: heroShow ? "translateY(0)" : "translateY(24px)",
              // eslint-disable-next-line react-hooks/refs
              transition: heroReveal.mounted
                ? "opacity 0.7s ease 120ms, transform 0.7s ease 120ms"
                : "none",
            }}
          >
            {data.title}
          </h1>

          {data.intro && (
            <p
              className="mx-auto max-w-xl text-[15px] leading-7 sm:text-lg sm:leading-relaxed"
              style={{
                color: "#5a5a48",
                opacity: heroShow ? 1 : 0,
                transform: heroShow ? "translateY(0)" : "translateY(24px)",
                // eslint-disable-next-line react-hooks/refs
                transition: heroReveal.mounted
                  ? "opacity 0.7s ease 240ms, transform 0.7s ease 240ms"
                  : "none",
              }}
            >
              {data.intro}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div
            className="grid grid-cols-1 gap-5 rounded-3xl px-5 py-6 sm:grid-cols-3 sm:gap-6 sm:px-8 sm:py-10"
            style={{
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(156,169,96,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <StatCounter value="10+" label="Năm kinh nghiệm" delay={0} />
            <StatCounter
              value="5000+"
              label="Khách hàng tin tưởng"
              delay={120}
            />
            <StatCounter value="50+" label="Sản phẩm & dịch vụ" delay={240} />
          </div>
        </div>
      </section>

      {data.intro && (
        <section className="px-4 py-8 sm:px-6 sm:py-10">
          <div
          // eslint-disable-next-line react-hooks/refs
            ref={introReveal.ref}
            className="mx-auto max-w-3xl"
            style={{
              opacity: introShow ? 1 : 0,
              transform: introShow ? "translateY(0)" : "translateY(32px)",
              // eslint-disable-next-line react-hooks/refs
              transition: introReveal.mounted
                ? "opacity 0.7s ease, transform 0.7s ease"
                : "none",
            }}
          >
            <div
              className="relative overflow-hidden rounded-3xl p-5 sm:p-8 md:p-12"
              style={{
                background:
                  "linear-gradient(135deg, rgba(156,169,96,0.2) 0%, rgba(196,184,122,0.15) 100%)",
                border: "1px solid rgba(156,169,96,0.25)",
              }}
            >
              <p
                className="relative text-[15px] leading-7 sm:text-lg sm:leading-relaxed"
                style={{ color: "#3a3a2a" }}
              >
                {data.intro}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-10">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="Tại WannaPet"
            title="Nội dung nổi bật"
            delay={0}
          />

          <div className="mt-6 grid gap-4 sm:mt-8">
            {Array.isArray(data.items) && data.items.length > 0 ? (
              data.items.map((item, i) => (
                <ServiceCard key={`${item.label}-${i}`} item={item} index={i} />
              ))
            ) : (
              <div
                className="rounded-2xl p-5 text-sm sm:p-6"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(156,169,96,0.2)",
                  color: "#6a6a52",
                }}
              >
                Chưa có nội dung hiển thị.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
