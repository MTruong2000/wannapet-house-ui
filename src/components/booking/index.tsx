"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface BookingService {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: number | null;
  image_url: string | null;
  location: {
    id: string;
    name: string;
    slug: string;
    address: string;
    phone: string;
  };
}

interface FormData {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  booking_date: string;
  booking_time: string;
  note: string;
}

interface FormErrors {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  booking_date?: string;
  booking_time?: string;
}

type ModalState = "form" | "loading" | "success" | "error";

interface BookingModalProps {
  service: BookingService | null;
  onClose: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

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

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function validatePhone(phone: string) {
  return /^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone.trim());
}

function validateEmail(email: string) {
  if (!email.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function IconX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconPaw() {
  return <span className="text-lg leading-none">🐾</span>;
}

function IconClock() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.89 12a19.79 19.79 0 0 1-3-8.72A2 2 0 0 1 4 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconNote() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(206,230,114,0.3)"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="#CEE672"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InputField({
  icon,
  label,
  required,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
        style={{ color: "rgba(240,247,220,0.7)" }}
      >
        <span style={{ color: "rgba(206,230,114,0.6)" }}>{icon}</span>
        {label}
        {required && <span style={{ color: "#E05A2B" }}>*</span>}
      </label>
      {children}
      {error && (
        <p
          className="text-[11px] font-semibold flex items-center gap-1"
          style={{ color: "#ff8a6b" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 12,
  border: "1.5px solid rgba(206,230,114,0.2)",
  background: "rgba(255,255,255,0.07)",
  color: "#F0F7DC",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s, background 0.2s",
  fontFamily: "inherit",
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  border: "1.5px solid rgba(255,120,80,0.6)",
  background: "rgba(255,100,60,0.08)",
};

export default function BookingModal({ service, onClose }: BookingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [modalState, setModalState] = useState<ModalState>("form");
  const [mounted, setMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<FormData>({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    booking_date: "",
    booking_time: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalState === "form") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    setMounted(false);
    setTimeout(onClose, 320);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current && modalState === "form") handleClose();
  };

  const setField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.customer_name.trim()) {
      newErrors.customer_name = "Vui lòng nhập họ tên.";
    } else if (form.customer_name.trim().length < 2) {
      newErrors.customer_name = "Tên phải có ít nhất 2 ký tự.";
    }

    if (!form.customer_phone.trim()) {
      newErrors.customer_phone = "Vui lòng nhập số điện thoại.";
    } else if (!validatePhone(form.customer_phone)) {
      newErrors.customer_phone = "Số điện thoại không hợp lệ (VD: 0912345678).";
    }

    if (!validateEmail(form.customer_email)) {
      newErrors.customer_email = "Email không đúng định dạng.";
    }

    if (!form.booking_date) {
      newErrors.booking_date = "Vui lòng chọn ngày đặt lịch.";
    } else if (form.booking_date < getTodayString()) {
      newErrors.booking_date = "Ngày đặt lịch không được trong quá khứ.";
    }

    if (!form.booking_time) {
      newErrors.booking_time = "Vui lòng chọn giờ.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !service) return;

    setModalState("loading");
    try {
      const res = await fetch(`${BASE_URL}/api/create-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku_service: service.slug,
          sku_location: service.location.slug,
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          customer_email: form.customer_email.trim() || undefined,
          booking_date: form.booking_date,
          booking_time: form.booking_time,
          note: form.note.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đặt lịch thất bại.");
      }

      setModalState("success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
      setErrorMessage(msg);
      setModalState("error");
    }
  };

  if (!service) return null;

  const getInputStyle = (field: keyof FormErrors): React.CSSProperties => ({
    ...(errors[field] ? inputErrorStyle : inputStyle),
    border:
      focusedField === field
        ? "1.5px solid rgba(206,230,114,0.6)"
        : errors[field]
        ? "1.5px solid rgba(255,120,80,0.6)"
        : "1.5px solid rgba(206,230,114,0.2)",
    background:
      focusedField === field
        ? "rgba(255,255,255,0.1)"
        : errors[field]
        ? "rgba(255,100,60,0.08)"
        : "rgba(255,255,255,0.07)",
    boxShadow:
      focusedField === field ? "0 0 0 3px rgba(206,230,114,0.1)" : "none",
  });

  const placeholderClass =
    "[&::placeholder]:text-[rgba(240,247,220,0.3)] [&::placeholder]:text-sm";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        background: mounted ? "rgba(10,18,5,0.75)" : "rgba(10,18,5,0)",
        backdropFilter: mounted ? "blur(8px)" : "blur(0px)",
        transition: "background 0.3s, backdrop-filter 0.3s",
      }}
    >
      <div
        className="relative w-full sm:max-w-lg overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg, #2C3B16 0%, #1a240d 100%)",
          borderRadius: "24px 24px 0 0",
          ...(typeof window !== "undefined" && window.innerWidth >= 640
            ? { borderRadius: 24 }
            : {}),
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(206,230,114,0.15)",
          maxHeight: "94dvh",
          transform: mounted
            ? "translateY(0) scale(1)"
            : "translateY(60px) scale(0.97)",
          opacity: mounted ? 1 : 0,
          transition:
            "transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #CEE672, #E05A2B, #CEE672, transparent)",
          }}
        />

        <div
          className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(206,230,114,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(206,230,114,0.12)" }}
            >
              <IconPaw />
            </div>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "rgba(206,230,114,0.5)" }}
              >
                Đặt lịch dịch vụ
              </p>
              <h2
                className="text-base font-extrabold leading-tight"
                style={{ color: "#F0F7DC", fontFamily: "'Nunito', sans-serif" }}
              >
                {service.name}
              </h2>
            </div>
          </div>

          {modalState === "form" && (
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(255,255,255,0.08)", color: "#F0F7DC" }}
            >
              <IconX />
            </button>
          )}
        </div>

        <div
          className="mx-5 mt-4 mb-1 rounded-2xl p-3.5 flex items-center gap-3 shrink-0"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(206,230,114,0.12)",
          }}
        >
          {service.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image_url}
              alt={service.name}
              className="w-12 h-12 rounded-xl object-cover shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-bold truncate"
              style={{ color: "#F0F7DC" }}
            >
              {service.name}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {service.price > 0 && (
                <span
                  className="text-xs font-extrabold"
                  style={{ color: "#E05A2B" }}
                >
                  {formatPrice(service.price)}
                </span>
              )}
              {service.duration && (
                <span
                  className="flex items-center gap-1 text-[11px]"
                  style={{ color: "rgba(206,230,114,0.6)" }}
                >
                  <IconClock /> {formatDuration(service.duration)}
                </span>
              )}
              <span
                className="flex items-center gap-1 text-[11px] truncate"
                style={{ color: "rgba(240,247,220,0.45)" }}
              >
                <IconPin /> {service.location.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {modalState === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <div className="relative">
                <Spinner />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ boxShadow: "0 0 24px rgba(206,230,114,0.2)" }}
                />
              </div>
              <p
                className="text-sm font-semibold animate-pulse"
                style={{ color: "rgba(206,230,114,0.7)" }}
              >
                Đang đặt lịch cho bé...
              </p>
            </div>
          )}

          {modalState === "success" && (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,78,30,0.4) 0%, rgba(90,114,40,0.3) 100%)",
                  boxShadow: "0 0 40px rgba(206,230,114,0.25)",
                  animation: "scaleIn 0.4s cubic-bezier(.22,1,.36,1)",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    fill="#CEE672"
                    fillOpacity="0.15"
                  />
                  <polyline
                    points="6 12 10 16 18 8"
                    stroke="#CEE672"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 20,
                      strokeDashoffset: 0,
                      animation: "drawCheck 0.5s 0.3s ease forwards",
                    }}
                  />
                </svg>
              </div>

              <div>
                <h3
                  className="text-xl font-extrabold mb-1"
                  style={{
                    color: "#CEE672",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Đặt lịch thành công! 🎉
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "rgba(240,247,220,0.6)" }}
                >
                  Chúng tôi sẽ liên hệ xác nhận lịch với bạn sớm nhất.
                </p>
              </div>

              <div
                className="w-full rounded-2xl p-4 mt-2 space-y-2"
                style={{
                  background: "rgba(206,230,114,0.06)",
                  border: "1px solid rgba(206,230,114,0.15)",
                }}
              >
                <Row label="Dịch vụ" value={service.name} />
                <Row label="Chi nhánh" value={service.location.name} />
                <Row
                  label="Ngày"
                  value={new Date(
                    form.booking_date + "T00:00:00"
                  ).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <Row label="Giờ" value={form.booking_time} />
                <Row label="Khách hàng" value={form.customer_name} />
                <Row label="SĐT" value={form.customer_phone} />
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl font-extrabold text-sm mt-2 transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #3B4E1E 0%, #5A7228 100%)",
                  color: "#CEE672",
                }}
              >
                Hoàn tất ✓
              </button>
            </div>
          )}

          {modalState === "error" && (
            <div className="flex flex-col items-center justify-center py-12 px-6 gap-4 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(224,90,43,0.15)",
                  boxShadow: "0 0 40px rgba(224,90,43,0.2)",
                }}
              >
                <span className="text-4xl">😿</span>
              </div>
              <div>
                <h3
                  className="text-lg font-extrabold mb-1"
                  style={{
                    color: "#ff8a6b",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  Đặt lịch thất bại
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "rgba(240,247,220,0.5)" }}
                >
                  {errorMessage}
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setModalState("form")}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    background: "rgba(206,230,114,0.1)",
                    color: "#CEE672",
                    border: "1px solid rgba(206,230,114,0.2)",
                  }}
                >
                  Thử lại
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(240,247,220,0.5)",
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {modalState === "form" && (
            <div className="px-5 py-4 space-y-4 pb-6">
              <InputField
                icon={<IconUser />}
                label="Họ & Tên"
                required
                error={errors.customer_name}
              >
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.customer_name}
                  onChange={(e) => setField("customer_name", e.target.value)}
                  onFocus={() => setFocusedField("customer_name")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("customer_name")}
                  className={placeholderClass}
                  autoComplete="name"
                />
              </InputField>

              <InputField
                icon={<IconPhone />}
                label="Số điện thoại"
                required
                error={errors.customer_phone}
              >
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={form.customer_phone}
                  onChange={(e) => setField("customer_phone", e.target.value)}
                  onFocus={() => setFocusedField("customer_phone")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("customer_phone")}
                  className={placeholderClass}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </InputField>

              <InputField
                icon={<IconMail />}
                label="Email"
                error={errors.customer_email}
              >
                <input
                  type="email"
                  placeholder="example@email.com (tuỳ chọn)"
                  value={form.customer_email}
                  onChange={(e) => setField("customer_email", e.target.value)}
                  onFocus={() => setFocusedField("customer_email")}
                  onBlur={() => setFocusedField(null)}
                  style={getInputStyle("customer_email")}
                  className={placeholderClass}
                  autoComplete="email"
                />
              </InputField>

              <div className="grid grid-cols-2 gap-3">
                <InputField
                  icon={<IconCalendar />}
                  label="Ngày"
                  required
                  error={errors.booking_date}
                >
                  <input
                    type="date"
                    min={getTodayString()}
                    value={form.booking_date}
                    onChange={(e) => setField("booking_date", e.target.value)}
                    onFocus={() => setFocusedField("booking_date")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...getInputStyle("booking_date"),
                      colorScheme: "dark",
                    }}
                    className={placeholderClass}
                  />
                </InputField>

                <InputField
                  icon={<IconClock />}
                  label="Giờ"
                  required
                  error={errors.booking_time}
                >
                  <select
                    value={form.booking_time}
                    onChange={(e) => setField("booking_time", e.target.value)}
                    onFocus={() => setFocusedField("booking_time")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      ...getInputStyle("booking_time"),
                      cursor: "pointer",
                      colorScheme: "dark",
                    }}
                  >
                    <option value="" disabled style={{ background: "#2C3B16" }}>
                      -- Chọn giờ --
                    </option>
                    {TIME_SLOTS.map((t) => (
                      <option
                        key={t}
                        value={t}
                        style={{ background: "#2C3B16" }}
                      >
                        {t}
                      </option>
                    ))}
                  </select>
                </InputField>
              </div>

              <InputField icon={<IconNote />} label="Ghi chú">
                <textarea
                  placeholder="Ghi chú thêm cho bé (tuỳ chọn)..."
                  value={form.note}
                  onChange={(e) => setField("note", e.target.value)}
                  onFocus={() => setFocusedField("note")}
                  onBlur={() => setFocusedField(null)}
                  rows={3}
                  style={{
                    ...inputStyle,
                    border:
                      focusedField === "note"
                        ? "1.5px solid rgba(206,230,114,0.6)"
                        : "1.5px solid rgba(206,230,114,0.2)",
                    background:
                      focusedField === "note"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.07)",
                    boxShadow:
                      focusedField === "note"
                        ? "0 0 0 3px rgba(206,230,114,0.1)"
                        : "none",
                    resize: "none",
                  }}
                  className={`${placeholderClass} resize-none`}
                />
              </InputField>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-2xl font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2"
                style={{
                  background:
                    "linear-gradient(135deg, #E05A2B 0%, #c04820 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(224,90,43,0.3)",
                }}
              >
                <IconPaw />
                XÁC NHẬN ĐẶT LỊCH
              </button>

              <p
                className="text-center text-[10px] opacity-40"
                style={{ color: "#F0F7DC" }}
              >
                Bằng cách đặt lịch, bạn đồng ý với điều khoản dịch vụ của Wanna
                Pet.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 20; }
          to   { stroke-dashoffset: 0;  }
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8);
          cursor: pointer;
        }
        input[type="date"], input[type="time"] {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span style={{ color: "rgba(206,230,114,0.5)" }}>{label}</span>
      <span className="font-semibold text-right" style={{ color: "#F0F7DC" }}>
        {value}
      </span>
    </div>
  );
}
