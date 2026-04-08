"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "@/components/admin/toast";

/* ─────────────────────────── Types ─────────────────────────── */
interface ServiceBooking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  note: string | null;
  status: "pending" | "confirmed" | "done" | "cancel";
  created_at: string;
  service_id: string;
  service_name: string;
  service_slug: string;
  service_price: number;
  service_duration: number | null;
  service_image_url: string | null;
  location_id: string;
  location_name: string;
  location_slug: string;
  location_address: string | null;
  location_phone: string | null;
}

interface SelectOption {
  id: string;
  name: string;
}

interface PaginatedResponse {
  success: boolean;
  data: ServiceBooking[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface FormState {
  service_id: string;
  location_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  booking_date: string;
  booking_time: string;
  note: string;
  status: string;
}

const EMPTY_FORM: FormState = {
  service_id: "",
  location_id: "",
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  booking_date: "",
  booking_time: "",
  note: "",
  status: "pending",
};

const API = "/api/admin";
const LIMIT = 10;

/* ─────────────────────── Status config ─────────────────────── */
const STATUS_CONFIG = {
  pending: {
    label: "Chờ xác nhận",
    dot: "bg-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  confirmed: {
    label: "Đã xác nhận",
    dot: "bg-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  done: {
    label: "Hoàn thành",
    dot: "bg-green-400",
    badge: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  cancel: {
    label: "Đã huỷ",
    dot: "bg-gray-500",
    badge: "bg-gray-700/50 text-gray-500 border-gray-700",
  },
} as const;

function StatusBadge({ status }: { status: string }) {
  const cfg =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN");
}

/* ─────────────────────── Detail Drawer ─────────────────────── */
function DetailDrawer({
  booking,
  onClose,
  onEdit,
  onStatusChange,
  onDelete,
}: {
  booking: ServiceBooking | null;
  onClose: () => void;
  onEdit: (b: ServiceBooking) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (b: ServiceBooking) => void;
}) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-gray-900 border-l border-gray-800 h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h3 className="text-white font-semibold text-sm">Chi tiết booking</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={booking.status} />
            <p className="text-xs text-gray-500">
              {new Date(booking.created_at).toLocaleString("vi-VN")}
            </p>
          </div>

          {/* Customer */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Khách hàng
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-400 font-semibold text-sm">
                  {booking.customer_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {booking.customer_name}
                </p>
                <p className="text-gray-400 text-xs">
                  {booking.customer_phone}
                </p>
              </div>
            </div>
            {booking.customer_email && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg
                  className="w-3.5 h-3.5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {booking.customer_email}
              </div>
            )}
          </div>

          {/* Booking Info */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Thông tin đặt lịch
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Ngày</p>
                <p className="text-white text-sm font-medium">
                  {formatDate(booking.booking_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Giờ</p>
                <p className="text-white text-sm font-medium">
                  {booking.booking_time.slice(0, 5)}
                </p>
              </div>
            </div>
            {booking.note && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Ghi chú</p>
                <p className="text-gray-300 text-sm italic">&quot;{booking.note}&quot;</p>
              </div>
            )}
          </div>

          {/* Service */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Dịch vụ
            </p>
            <div>
              <p className="text-white font-medium text-sm">
                {booking.service_name}
              </p>
              <p className="text-amber-400 text-sm mt-1">
                {formatPrice(booking.service_price)}
              </p>
              {booking.service_duration && (
                <p className="text-gray-500 text-xs mt-0.5">
                  {booking.service_duration} phút
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Chi nhánh
            </p>
            <p className="text-white text-sm font-medium">
              {booking.location_name}
            </p>
            {booking.location_address && (
              <p className="text-gray-400 text-xs">
                {booking.location_address}
              </p>
            )}
            {booking.location_phone && (
              <p className="text-gray-400 text-xs">{booking.location_phone}</p>
            )}
          </div>

          {/* Quick status change */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
              Cập nhật trạng thái
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.keys(STATUS_CONFIG) as Array<keyof typeof STATUS_CONFIG>
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(booking.id, s)}
                  disabled={booking.status === s}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                    ${
                      booking.status === s
                        ? STATUS_CONFIG[s].badge + " border opacity-100"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white"
                    }`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-800 p-4 flex gap-3">
          <button
            onClick={() => onEdit(booking)}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => onDelete(booking)}
            className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Booking Modal ─────────────────────── */
function BookingModal({
  open,
  onClose,
  onSave,
  editTarget,
  form,
  setForm,
  saving,
  services,
  locations,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editTarget: ServiceBooking | null;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  saving: boolean;
  services: SelectOption[];
  locations: SelectOption[];
}) {
  if (!open) return null;

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-gray-600";
  const labelClass = "block text-sm text-gray-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl my-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-base">
            {editTarget ? "Cập nhật booking" : "Tạo booking mới"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Tên khách hàng <span className="text-red-400">*</span>
              </label>
              <input
                className={inputClass}
                value={form.customer_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer_name: e.target.value }))
                }
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className={labelClass}>
                Số điện thoại <span className="text-red-400">*</span>
              </label>
              <input
                className={inputClass}
                value={form.customer_phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer_phone: e.target.value }))
                }
                placeholder="0901234567"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.customer_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, customer_email: e.target.value }))
              }
              placeholder="email@example.com"
            />
          </div>

          {/* Service & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Dịch vụ <span className="text-red-400">*</span>
              </label>
              <select
                className={inputClass}
                value={form.service_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, service_id: e.target.value }))
                }
              >
                <option value="">— Chọn dịch vụ —</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Chi nhánh <span className="text-red-400">*</span>
              </label>
              <select
                className={inputClass}
                value={form.location_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location_id: e.target.value }))
                }
              >
                <option value="">— Chọn chi nhánh —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Ngày đặt <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.booking_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, booking_date: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className={labelClass}>
                Giờ đặt <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                className={inputClass}
                value={form.booking_time}
                onChange={(e) =>
                  setForm((f) => ({ ...f, booking_time: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Status (edit only) */}
          {editTarget && (
            <div>
              <label className={labelClass}>Trạng thái</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="done">Hoàn thành</option>
                <option value="cancel">Đã huỷ</option>
              </select>
            </div>
          )}

          {/* Note */}
          <div>
            <label className={labelClass}>Ghi chú</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Ghi chú thêm từ khách hàng..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={onSave}
            disabled={
              saving ||
              !form.customer_name.trim() ||
              !form.customer_phone.trim() ||
              !form.service_id ||
              !form.location_id ||
              !form.booking_date ||
              !form.booking_time
            }
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {editTarget ? "Cập nhật" : "Tạo booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Delete Dialog ─────────────────────── */
function DeleteDialog({
  target,
  onCancel,
  onConfirm,
  deleting,
}: {
  target: ServiceBooking | null;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  if (!target) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Xác nhận xoá</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              Xoá booking của{" "}
              <span className="text-white font-medium">
                &quot;{target.customer_name}&quot;
              </span>
              ? Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-400 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main Page ─────────────────────────── */
export default function ServiceBookingsPage() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);

  const [detailTarget, setDetailTarget] = useState<ServiceBooking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ServiceBooking | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ServiceBooking | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Fetch bookings ── */
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search,
        status: filterStatus,
      });
      if (filterDate) params.set("booking_date", filterDate);

      const res = await fetch(`${API}/service-bookings?${params}`, {
        credentials: "include",
      });
      const json: PaginatedResponse = await res.json();
      setBookings(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.total_pages ?? 1);
    } catch {
      toast.error("Không thể tải danh sách booking");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterDate, page]);

  /* ── Fetch options ── */
  const fetchOptions = useCallback(async () => {
    try {
      const [svcRes, locRes] = await Promise.all([
        fetch(`${API}/services`, { credentials: "include" }),
        fetch(`${API}/locations`, { credentials: "include" }),
      ]);
      const svcs = await svcRes.json();
      const locs = await locRes.json();
      setServices(Array.isArray(svcs) ? svcs : svcs.data ?? []);
      setLocations(Array.isArray(locs) ? locs : locs.data ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchBookings(), 300);
    return () => clearTimeout(t);
  }, [fetchBookings]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  /* ── Handlers ── */
  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDetailTarget(null);
    setShowModal(true);
  };

  const openEdit = (b: ServiceBooking) => {
    setEditTarget(b);
    setForm({
      service_id: b.service_id,
      location_id: b.location_id,
      customer_name: b.customer_name,
      customer_phone: b.customer_phone,
      customer_email: b.customer_email ?? "",
      booking_date: b.booking_date,
      booking_time: b.booking_time.slice(0, 5),
      note: b.note ?? "",
      status: b.status,
    });
    setDetailTarget(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (
      !form.customer_name.trim() ||
      !form.customer_phone.trim() ||
      !form.service_id ||
      !form.location_id ||
      !form.booking_date ||
      !form.booking_time
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      let res: Response;

      if (editTarget) {
        res = await fetch(`${API}/service-bookings/${editTarget.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            customer_name: form.customer_name.trim(),
            customer_phone: form.customer_phone.trim(),
            customer_email: form.customer_email.trim() || null,
            booking_date: form.booking_date,
            booking_time: form.booking_time,
            note: form.note.trim() || null,
            status: form.status,
          }),
        });
      } else {
        res = await fetch(`${API}/service-bookings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            service_id: form.service_id,
            location_id: form.location_id,
            customer_name: form.customer_name.trim(),
            customer_phone: form.customer_phone.trim(),
            customer_email: form.customer_email.trim() || null,
            booking_date: form.booking_date,
            booking_time: form.booking_time,
            note: form.note.trim() || null,
          }),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }

      toast.success(
        editTarget ? "Cập nhật thành công" : "Tạo booking thành công"
      );
      closeModal();
      fetchBookings();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API}/service-bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }
      toast.success("Cập nhật trạng thái thành công");
      setDetailTarget((prev) =>
        prev ? { ...prev, status: status as ServiceBooking["status"] } : null
      );
      fetchBookings();
    } catch {
      toast.error("Lỗi server");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/service-bookings/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }
      toast.success("Đã xoá booking");
      setDeleteTarget(null);
      setDetailTarget(null);
      if (bookings.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchBookings();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterDate("");
    setPage(1);
  };

  const hasFilters = search || filterStatus || filterDate;

  /* ── Render ── */
  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-800 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-semibold text-sm shrink-0">
              Đặt lịch dịch vụ
            </h2>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold text-xs rounded-xl px-4 py-2 transition-colors shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Tạo booking
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="bg-gray-800 border border-gray-700 text-white rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all w-52 placeholder-gray-600"
                placeholder="Tên, SĐT, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Status filter */}
            <select
              className="bg-gray-800 border border-gray-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="done">Hoàn thành</option>
              <option value="cancel">Đã huỷ</option>
            </select>

            {/* Date filter */}
            <input
              type="date"
              className="bg-gray-800 border border-gray-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setPage(1);
              }}
            />

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-gray-800"
              >
                Xoá bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {[
                  "#",
                  "Khách hàng",
                  "Dịch vụ",
                  "Chi nhánh",
                  "Ngày & Giờ",
                  "Trạng thái",
                  "Thao tác",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 ${
                      i === 6 ? "text-right" : "text-left"
                    } ${i === 0 ? "w-10" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div
                          className="h-4 bg-gray-800 rounded animate-pulse"
                          style={{ width: j === 6 ? "80px" : "100%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <svg
                        className="w-10 h-10 opacity-30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">
                        {hasFilters
                          ? "Không tìm thấy kết quả nào."
                          : "Chưa có booking nào."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking, idx) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                    onClick={() => setDetailTarget(booking)}
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium leading-tight">
                          {booking.customer_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {booking.customer_phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm">
                        {booking.service_name}
                      </p>
                      <p className="text-xs text-amber-400/70 mt-0.5">
                        {formatPrice(booking.service_price)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {booking.location_name}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">
                        {formatDate(booking.booking_date)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {booking.booking_time.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(booking)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget(booking)}
                          className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Tổng <span className="text-white">{total}</span> booking
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        p === page
                          ? "bg-amber-500 text-gray-950"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        booking={detailTarget}
        onClose={() => setDetailTarget(null)}
        onEdit={openEdit}
        onStatusChange={handleStatusChange}
        onDelete={(b) => {
          setDeleteTarget(b);
          setDetailTarget(null);
        }}
      />

      {/* Create/Edit Modal */}
      <BookingModal
        key={editTarget?.id ?? "new"}
        open={showModal}
        onClose={closeModal}
        onSave={handleSubmit}
        editTarget={editTarget}
        form={form}
        setForm={setForm}
        saving={submitting}
        services={services}
        locations={locations}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        target={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}
