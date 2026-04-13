"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BookingModal from "@/components/booking";

interface ServiceFeature {
  id: string;
  title: string;
  sort_order: number;
}

interface ServiceLocation {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
}

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number | null;
  image_url: string | null;
  created_at: string;
  location: ServiceLocation;
  features: ServiceFeature[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}p` : `${h} giờ`;
}

function CheckIcon({ color = "#3B4E1E" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill={color} fillOpacity="0.12" />
      <polyline
        points="6 12 10 16 18 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
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
      { threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, mounted, visible };
}

function ServiceBannerCard({
  service,
  index,
  flip,
  onBook,
}: {
  service: Service;
  index: number;
  flip: boolean;
  onBook: (service: Service) => void;
}) {
  const { ref, mounted, visible } = useReveal();
  const show = !mounted || visible;

  const isLight = index % 2 === 0;
  const bg = isLight ? "#F0F7DC" : "#3B4E1E";
  const textColor = isLight ? "#3B4E1E" : "#F0F7DC";
  const subTextColor = isLight ? "#5A7228" : "#CEE672";
  const featureCheckColor = isLight ? "#3B4E1E" : "#CEE672";
  const ctaBg = isLight
    ? "linear-gradient(135deg, #3B4E1E 0%, #5A7228 100%)"
    : "linear-gradient(135deg, #E05A2B 0%, #c04820 100%)";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl shadow-xl"
      style={{
        background: bg,
        opacity: show ? 1 : 0,
        transform: show
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.97)",
        transition: mounted
          ? `opacity 0.6s cubic-bezier(.22,1,.36,1) ${index * 120}ms,
             transform 0.6s cubic-bezier(.22,1,.36,1) ${index * 120}ms`
          : "none",
      }}
    >
      <div
        className="absolute pointer-events-none select-none"
        style={{
          right: flip ? "auto" : 8,
          left: flip ? 8 : "auto",
          bottom: -10,
          fontSize: 110,
          opacity: 0.05,
          lineHeight: 1,
        }}
      >
        🐾
      </div>

      <div className={`flex ${flip ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className="relative shrink-0 overflow-hidden"
          style={{ width: "42%", aspectRatio: "1 / 1" }}
        >
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 640px) 42vw, 320px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: isLight ? "#DFF0A0" : "#2C3B16" }}
            >
              <span className="text-7xl opacity-20">🐾</span>
            </div>
          )}

          {service.duration && (
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                color: "#CEE672",
              }}
            >
              <ClockIcon /> {formatDuration(service.duration)}
            </div>
          )}

          <div
            className="absolute left-0 top-0 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white"
            style={{ background: "#E05A2B", borderBottomRightRadius: 14 }}
          >
            Wannapet
          </div>
        </div>

        <div className="z-10 flex flex-1 flex-col justify-center gap-3 self-stretch p-5 sm:p-6">
          <div>
            <p
              className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] opacity-60"
              style={{ color: subTextColor }}
            >
              Dịch vụ chuyên nghiệp
            </p>

            <h2
              className="text-lg font-extrabold leading-tight sm:text-xl"
              style={{ color: textColor, fontFamily: "'Nunito', sans-serif" }}
            >
              {service.name}
            </h2>
          </div>

          {service.features.length > 0 && (
            <ul className="space-y-1.5">
              {service.features.slice(0, 5).map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <CheckIcon color={featureCheckColor} />
                  <span
                    className="text-xs font-semibold leading-snug sm:text-sm"
                    style={{ color: textColor, opacity: 0.85 }}
                  >
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {service.features.length === 0 && service.description && (
            <p
              className="line-clamp-3 text-xs leading-relaxed opacity-70"
              style={{ color: textColor }}
            >
              {service.description}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onBook(service)}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: ctaBg }}
            >
              ĐẶT LỊCH NGAY
            </button>

            {service.price > 0 && (
              <div>
                <p
                  className="text-[9px] uppercase tracking-widest opacity-50"
                  style={{ color: textColor }}
                >
                  Từ
                </p>
                <p
                  className="text-sm font-extrabold"
                  style={{ color: isLight ? "#E05A2B" : "#CEE672" }}
                >
                  {formatPrice(service.price)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-28">
      <div className="text-6xl">🐾</div>
      <p
        className="max-w-xs text-center text-base font-semibold"
        style={{ color: "#3B4E1E" }}
      >
        {message}
      </p>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div
        className="h-px flex-1 rounded-full"
        style={{ background: "rgba(59,78,30,0.2)" }}
      />
      <span
        className="rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em]"
        style={{ background: "rgba(59,78,30,0.12)", color: "#3B4E1E" }}
      >
        {label}
      </span>
      <div
        className="h-px flex-1 rounded-full"
        style={{ background: "rgba(59,78,30,0.2)" }}
      />
    </div>
  );
}

function PaginationBar({
  pagination,
  onPage,
}: {
  pagination: Pagination;
  onPage: (p: number) => void;
}) {
  if (pagination.total_pages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        disabled={!pagination.has_prev}
        onClick={() => onPage(pagination.page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold disabled:opacity-30"
        style={{ background: "rgba(255,255,255,0.6)", color: "#3B4E1E" }}
      >
        ‹
      </button>

      {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
        (p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-200"
            style={{
              background:
                p === pagination.page ? "#3B4E1E" : "rgba(255,255,255,0.6)",
              color: p === pagination.page ? "#CEE672" : "#3B4E1E",
              transform: p === pagination.page ? "scale(1.12)" : "scale(1)",
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={!pagination.has_next}
        onClick={() => onPage(pagination.page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold disabled:opacity-30"
        style={{ background: "rgba(255,255,255,0.6)", color: "#3B4E1E" }}
      >
        ›
      </button>
    </div>
  );
}

export default function ServicesPageClient({
  services,
  pagination,
  error,
}: {
  services: Service[];
  pagination: Pagination | null;
  error: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingService, setBookingService] = useState<Service | null>(null);

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const qs = params.toString();
    router.push(qs ? `/dich-vu?${qs}` : "/dich-vu");
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#A8BC70",
        backgroundImage:
          "radial-gradient(ellipse at 10% 0%, #D4E890 0%, transparent 45%), radial-gradient(ellipse at 90% 100%, #7A9C40 0%, transparent 45%)",
      }}
    >
      <div
        className="w-full px-4 pb-7 pt-10 text-center"
        style={{
          background:
            "linear-gradient(to bottom, rgba(59,78,30,0.15), transparent)",
        }}
      >
        <div
          className="mb-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest"
          style={{ background: "rgba(255,255,255,0.4)", color: "#3B4E1E" }}
        >
          🐾 Wannapet
        </div>

        <h1
          className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          style={{ color: "#3B4E1E", fontFamily: "'Nunito', sans-serif" }}
        >
          Chăm sóc &amp; Grooming
          <br />
          <span style={{ color: "#E05A2B" }}>Thú cưng chuyên nghiệp</span>
        </h1>

        <p
          className="mx-auto mt-2 max-w-sm text-sm opacity-60"
          style={{ color: "#3B4E1E" }}
        >
          Tại Wanna Pet — mỗi bé đều xứng đáng được yêu thương 💚
        </p>

        {pagination && !error && (
          <p className="mt-2 text-xs opacity-45" style={{ color: "#3B4E1E" }}>
            {pagination.total} dịch vụ tại chi nhánh của bạn
          </p>
        )}
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-4 px-10 pb-20">
        {error && <EmptyState message={error} />}

        {!error && services.length === 0 && (
          <EmptyState message="Chưa có dịch vụ tại chi nhánh này." />
        )}

        {!error && services.length > 0 && (
          <>
            <SectionDivider label="Dịch vụ nổi bật" />
            {services.map((service, i) => (
              <ServiceBannerCard
                key={service.id}
                service={service}
                index={i}
                flip={i % 2 !== 0}
                onBook={setBookingService}
              />
            ))}
          </>
        )}

        {pagination && !error && (
          <PaginationBar pagination={pagination} onPage={changePage} />
        )}
      </div>

      {bookingService && (
        <BookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
        />
      )}
    </main>
  );
}
