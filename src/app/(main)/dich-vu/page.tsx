"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────── Types ─────────────────────────── */
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

interface ApiResponse {
  success: boolean;
  data: Service[];
  pagination: Pagination;
}

/* ─────────────────────────── Constants ─────────────────────────── */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2906";
const LIMIT = 10;

/* ─────────────────────────── Helpers ─────────────────────────── */
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

/* ─────────────────────────── Check Icon ─────────────────────────── */
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

/* ─────────────────────────── Clock Icon ─────────────────────────── */
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

/* ─────────────────────────── Skeleton Banner ─────────────────────────── */
function SkeletonBanner({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden animate-pulse flex ${
        flip ? "flex-row-reverse" : "flex-row"
      }`}
      style={{ background: "rgba(255,255,255,0.25)", minHeight: 220 }}
    >
      <div className="w-[45%] shrink-0 bg-white/30" />
      <div className="flex-1 p-6 space-y-3 flex flex-col justify-center">
        <div className="h-6 w-2/3 rounded-full bg-white/40" />
        <div className="h-4 w-full rounded-full bg-white/30" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-4/5 rounded-full bg-white/25" />
        ))}
        <div className="h-10 w-36 rounded-2xl bg-white/40 mt-2" />
      </div>
    </div>
  );
}

/* ─────────────────────────── Service Banner Card ─────────────────────────── */
function ServiceBannerCard({
  service,
  index,
  flip,
}: {
  service: Service;
  index: number;
  flip: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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

  /* alternating background tones */
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
      className="relative rounded-3xl overflow-hidden shadow-xl"
      style={{
        background: bg,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : `translateY(40px) scale(0.97)`,
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${index * 120}ms,
                     transform 0.6s cubic-bezier(.22,1,.36,1) ${index * 120}ms`,
      }}
    >
      {/* Decorative paw watermark */}
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
        {/* ── Image half — square 1:1 (624×624) ── */}
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
              className="w-full h-full flex items-center justify-center"
              style={{ background: isLight ? "#DFF0A0" : "#2C3B16" }}
            >
              <span className="text-7xl opacity-20">🐾</span>
            </div>
          )}

          {/* Duration pill */}
          {service.duration && (
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                color: "#CEE672",
              }}
            >
              <ClockIcon />
              {formatDuration(service.duration)}
            </div>
          )}

          {/* Corner ribbon */}
          <div
            className="absolute top-0 left-0 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white"
            style={{
              background: "#E05A2B",
              borderBottomRightRadius: 14,
            }}
          >
            Wannapet
          </div>
        </div>

        {/* ── Content half ── */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center gap-3 z-10 self-stretch">
          {/* Title */}
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1 opacity-60"
              style={{ color: subTextColor }}
            >
              Dịch vụ chuyên nghiệp
            </p>
            <h2
              className="text-lg sm:text-xl font-extrabold leading-tight"
              style={{ color: textColor, fontFamily: "'Nunito', sans-serif" }}
            >
              {service.name}
            </h2>
          </div>

          {/* Features checklist */}
          {service.features.length > 0 && (
            <ul className="space-y-1.5">
              {service.features.slice(0, 5).map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <CheckIcon color={featureCheckColor} />
                  <span
                    className="text-xs sm:text-sm font-semibold leading-snug"
                    style={{ color: textColor, opacity: 0.85 }}
                  >
                    {f.title}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* If no features, show description */}
          {service.features.length === 0 && service.description && (
            <p
              className="text-xs leading-relaxed opacity-70 line-clamp-3"
              style={{ color: textColor }}
            >
              {service.description}
            </p>
          )}

          {/* Bottom row: price + CTA */}
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <Link
              href={`/dich-vu/${service.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md"
              style={{ background: ctaBg }}
            >
              ĐẶT LỊCH NGAY
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 8 16 12 12 16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </Link>

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

/* ─────────────────────────── Empty State ─────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-4">
      <div className="text-6xl animate-bounce">🐾</div>
      <p
        className="text-base font-semibold text-center max-w-xs"
        style={{ color: "#3B4E1E" }}
      >
        {message}
      </p>
    </div>
  );
}

/* ─────────────────────────── Section Label ─────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div
        className="h-px flex-1 rounded-full"
        style={{ background: "rgba(59,78,30,0.2)" }}
      />
      <span
        className="text-xs font-extrabold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
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

/* ─────────────────────────── Pagination ─────────────────────────── */
function Pagination({
  pagination,
  onPage,
}: {
  pagination: Pagination;
  onPage: (p: number) => void;
}) {
  if (pagination.total_pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={!pagination.has_prev}
        onClick={() => onPage(pagination.page - 1)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold disabled:opacity-30"
        style={{ background: "rgba(255,255,255,0.6)", color: "#3B4E1E" }}
      >
        ‹
      </button>
      {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
        (p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
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
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold disabled:opacity-30"
        style={{ background: "rgba(255,255,255,0.6)", color: "#3B4E1E" }}
      >
        ›
      </button>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────────── */
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchServices = useCallback(async () => {
    const locationSlug = localStorage.getItem("selected_location_slug") || "";
    if (!locationSlug) {
      setError("Vui lòng chọn chi nhánh để xem dịch vụ.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sku_location: locationSlug,
        page: String(page),
        limit: String(LIMIT),
      });
      const res = await fetch(`${BASE_URL}/api/services?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setServices(json.data);
      setPagination(json.pagination);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <main
      className="min-h-screen"
      style={{
        background: "#A8BC70",
        backgroundImage:
          "radial-gradient(ellipse at 10% 0%, #D4E890 0%, transparent 45%), radial-gradient(ellipse at 90% 100%, #7A9C40 0%, transparent 45%)",
      }}
    >
      {/* ── Hero ── */}
      <div
        className="w-full pt-10 pb-7 px-4 text-center"
        style={{
          background:
            "linear-gradient(to bottom, rgba(59,78,30,0.15), transparent)",
        }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-3"
          style={{ background: "rgba(255,255,255,0.4)", color: "#3B4E1E" }}
        >
          🐾 Wannapet
        </div>

        <h1
          className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight"
          style={{ color: "#3B4E1E", fontFamily: "'Nunito', sans-serif" }}
        >
          Chăm sóc &amp; Grooming
          <br />
          <span style={{ color: "#E05A2B" }}>Thú cưng chuyên nghiệp</span>
        </h1>

        <p
          className="mt-2 text-sm opacity-60 max-w-sm mx-auto"
          style={{ color: "#3B4E1E" }}
        >
          Tại Wanna Pet — mỗi bé đều xứng đáng được yêu thương 💚
        </p>

        {pagination && !loading && (
          <p className="mt-2 text-xs opacity-45" style={{ color: "#3B4E1E" }}>
            {pagination.total} dịch vụ tại chi nhánh của bạn
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <div className="w-full max-w-[1200px] mx-auto px-10 pb-20 space-y-4">
        {/* Loading skeletons */}
        {loading && (
          <>
            <SectionDivider label="Đang tải..." />
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBanner key={i} flip={i % 2 !== 0} />
            ))}
          </>
        )}

        {/* Error */}
        {!loading && error && <EmptyState message={error} />}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
          <EmptyState message="Chưa có dịch vụ tại chi nhánh này." />
        )}

        {/* Service banners */}
        {!loading && !error && services.length > 0 && (
          <>
            <SectionDivider label="Dịch vụ nổi bật" />
            {services.map((service, i) => (
              <ServiceBannerCard
                key={service.id}
                service={service}
                index={i}
                flip={i % 2 !== 0}
              />
            ))}
          </>
        )}

        {/* Pagination */}
        {pagination && !loading && !error && (
          <Pagination pagination={pagination} onPage={setPage} />
        )}
      </div>
    </main>
  );
}
