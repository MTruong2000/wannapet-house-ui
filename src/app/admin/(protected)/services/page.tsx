"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "@/components/admin/toast";
import Image from "next/image";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  duration: number | null;
  image_url: string | null;
  category_id: string | null;
  category_name: string | null;
  location_id: string | null;
  location_name: string | null;
  is_active: boolean;
  created_at: string;
  total_features?: number;
}

interface ServiceDetail extends Service {
  category: { id: string; name: string; slug: string } | null;
  location: {
    id: string;
    name: string;
    slug: string;
    address: string;
    phone: string;
  } | null;
  features: Feature[];
}

interface Feature {
  id?: string;
  title: string;
  sort_order: number;
}

interface SelectOption {
  id: string;
  name: string;
}

interface PaginatedResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  category_id: string;
  location_id: string;
  is_active: boolean;
  features: Feature[];
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  duration: "",
  image_url: "",
  category_id: "",
  location_id: "",
  is_active: true,
  features: [],
};

const API = "/api/admin";
const LIMIT = 10;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDuration(minutes: number | null) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}p` : `${h} giờ`;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh tối đa 5MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API}/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Upload thất bại");
        return;
      }
      onChange(json.url);
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">Ảnh dịch vụ</label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
          <div className="w-full flex items-center justify-center bg-gray-800 rounded-xl min-h-[160px] max-h-[320px] overflow-hidden p-2">
            <Image
              src={value}
              alt="Service"
              width={400}
              height={400}
              className="object-contain max-h-[300px] w-auto h-auto"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-amber-500 text-gray-950 font-semibold text-xs rounded-lg transition-colors hover:bg-amber-400"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-4 py-2 bg-red-500/80 text-white font-semibold text-xs rounded-lg transition-colors hover:bg-red-500"
            >
              Xoá
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            dragOver
              ? "border-amber-500 bg-amber-500/5"
              : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
          }`}
        >
          {uploading ? (
            <>
              <svg
                className="w-8 h-8 text-amber-500 animate-spin"
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
              <p className="text-sm text-gray-400">Đang tải lên...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-gray-700/50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-300">
                  Kéo thả hoặc <span className="text-amber-400">chọn ảnh</span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  PNG, JPG, WEBP – tối đa 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-amber-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─── Features Editor ─── */
function FeaturesEditor({
  features,
  onChange,
}: {
  features: Feature[];
  onChange: (features: Feature[]) => void;
}) {
  const [newTitle, setNewTitle] = useState("");

  const addFeature = () => {
    const title = newTitle.trim();
    if (!title) return;
    onChange([...features, { title, sort_order: features.length }]);
    setNewTitle("");
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  const updateTitle = (index: number, title: string) => {
    onChange(features.map((f, i) => (i === index ? { ...f, title } : f)));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...features];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((f, i) => ({ ...f, sort_order: i })));
  };

  const moveDown = (index: number) => {
    if (index === features.length - 1) return;
    const next = [...features];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((f, i) => ({ ...f, sort_order: i })));
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">
        Tính năng / Bao gồm
      </label>

      <div className="space-y-2 mb-2">
        {features.map((feat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2"
          >
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="text-gray-600 hover:text-gray-400 disabled:opacity-30 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === features.length - 1}
                className="text-gray-600 hover:text-gray-400 disabled:opacity-30 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <span className="text-xs text-gray-600 w-5 text-center shrink-0">
              {index + 1}
            </span>

            <input
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-600"
              value={feat.title}
              onChange={(e) => updateTitle(index, e.target.value)}
              placeholder="Tên tính năng..."
            />

            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
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
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-gray-600"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }}
          placeholder="Thêm tính năng mới... (Enter để thêm)"
        />
        <button
          type="button"
          onClick={addFeature}
          disabled={!newTitle.trim()}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl text-sm transition-colors disabled:opacity-40 shrink-0"
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
        </button>
      </div>
    </div>
  );
}

/* ─── Service Modal ─── */
function ServiceModal({
  open,
  onClose,
  onSave,
  editTarget,
  form,
  setForm,
  saving,
  categories,
  locations,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editTarget: Service | null;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  saving: boolean;
  categories: SelectOption[];
  locations: SelectOption[];
}) {
  if (!open) return null;

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-gray-600";
  const labelClass = "block text-sm text-gray-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-base">
            {editTarget ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
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
          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
          />

          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Tên dịch vụ <span className="text-red-400">*</span>
              </label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: editTarget ? f.slug : toSlug(e.target.value),
                  }))
                }
                placeholder="VD: Massage thư giãn toàn thân"
              />
            </div>
            <div>
              <label className={labelClass}>
                Slug{" "}
                <span className="text-gray-600 text-xs">(tự động tạo)</span>
              </label>
              <input
                className={`${inputClass} font-mono`}
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="massage-thu-gian-toan-than"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Mô tả</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Mô tả ngắn về dịch vụ..."
            />
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Giá dịch vụ <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className={`${inputClass} pr-14`}
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="0"
                  min={0}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  VNĐ
                </span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Thời gian (phút)</label>
              <div className="relative">
                <input
                  type="number"
                  className={`${inputClass} pr-16`}
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="60"
                  min={0}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                  phút
                </span>
              </div>
            </div>
          </div>

          {/* Category + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Danh mục</label>
              <select
                className={inputClass}
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
              >
                <option value="">— Chọn danh mục —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Chi nhánh</label>
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

          {/* Features */}
          <FeaturesEditor
            features={form.features}
            onChange={(features) => setForm((f) => ({ ...f, features }))}
          />

          {/* Toggle */}
          <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm text-gray-300">Hiển thị</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Cho phép xem trên web
              </p>
            </div>
            <Toggle
              value={form.is_active}
              onChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
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
            disabled={saving || !form.name.trim() || !form.slug.trim()}
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
            {editTarget ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Dialog ─── */
function DeleteDialog({
  target,
  onCancel,
  onConfirm,
  deleting,
}: {
  target: Service | null;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  if (!target) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
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
              Xoá dịch vụ{" "}
              <span className="text-white font-medium">
                &quot;{target.name}&quot;
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

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Fetch ── */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: String(page),
        limit: String(LIMIT),
      });
      const res = await fetch(`${API}/services?${params}`, {
        credentials: "include",
      });
      const json: PaginatedResponse = await res.json();
      setServices(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.total_pages ?? 1);
    } catch {
      toast.error("Không thể tải dịch vụ");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  const fetchOptions = useCallback(async () => {
    try {
      const [catRes, locRes] = await Promise.all([
        fetch(`${API}/categories/all`, { credentials: "include" }),
        fetch(`${API}/locations`, { credentials: "include" }),
      ]);
      const cats = await catRes.json();
      const locs = await locRes.json();
      setCategories(Array.isArray(cats) ? cats : cats.data ?? []);
      setLocations(Array.isArray(locs) ? locs : locs.data ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchServices(), 300);
    return () => clearTimeout(t);
  }, [fetchServices]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  /* ── Handlers ── */
  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = async (s: Service) => {
    setEditTarget(s);
    try {
      const res = await fetch(`${API}/services/${s.id}`, {
        credentials: "include",
      });
      const detail: ServiceDetail = await res.json();
      setForm({
        name: detail.name,
        slug: detail.slug,
        description: detail.description ?? "",
        price: String(detail.price),
        duration: detail.duration ? String(detail.duration) : "",
        image_url: detail.image_url ?? "",
        category_id: detail.category?.id ?? "",
        location_id: detail.location?.id ?? "",
        is_active: detail.is_active,
        features: detail.features ?? [],
      });
    } catch {
      setForm({
        name: s.name,
        slug: s.slug,
        description: s.description ?? "",
        price: String(s.price),
        duration: s.duration ? String(s.duration) : "",
        image_url: s.image_url ?? "",
        category_id: s.category_id ?? "",
        location_id: s.location_id ?? "",
        is_active: s.is_active,
        features: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Vui lòng điền tên và slug");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price) || 0,
        duration:
          form.duration !== "" && form.duration !== null
            ? parseInt(form.duration, 10)
            : null,
        image_url: form.image_url || null,
        category_id: form.category_id || null,
        location_id: form.location_id || null,
        is_active: form.is_active,
        features: form.features.map((f, i) => ({
          title: f.title,
          sort_order: i,
        })),
      };

      const res = await fetch(
        editTarget ? `${API}/services/${editTarget.id}` : `${API}/services`,
        {
          method: editTarget ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Slug đã tồn tại");
        } else {
          toast.error(json.message ?? "Lỗi không xác định");
        }
        return;
      }

      toast.success(
        editTarget ? "Cập nhật thành công" : "Thêm dịch vụ thành công"
      );
      closeModal();
      fetchServices();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/services/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }
      toast.success("Đã xoá dịch vụ");
      setDeleteTarget(null);
      if (services.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchServices();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Render ── */
  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 gap-4">
          <h2 className="text-white font-semibold text-sm shrink-0">Dịch vụ</h2>
          <div className="flex items-center gap-3 flex-1 justify-end">
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
                placeholder="Tìm dịch vụ..."
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

            {/* Add button */}
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
              Thêm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {[
                  "#",
                  "Dịch vụ",
                  "Danh mục",
                  "Giá",
                  "Thời gian",
                  "Tính năng",
                  "Trạng thái",
                  "Thao tác",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 ${
                      i === 7 ? "text-right" : "text-left"
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
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div
                          className="h-4 bg-gray-800 rounded animate-pulse"
                          style={{ width: j === 7 ? "80px" : "100%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-sm">
                        {search
                          ? "Không tìm thấy kết quả nào."
                          : "Chưa có dịch vụ nào."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service, idx) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>

                    {/* Name + image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {service.image_url ? (
                          <div className="relative w-10 h-10 shrink-0">
                            <Image
                              src={service.image_url}
                              alt={service.name}
                              fill
                              className="object-cover rounded-lg"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                            <svg
                              className="w-5 h-5 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium leading-tight">
                            {service.name}
                          </p>
                          <p className="text-xs font-mono text-amber-400/70 mt-0.5">
                            {service.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {service.category_name ?? (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium">
                        {formatPrice(service.price)}
                      </p>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4">
                      {service.duration ? (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-300 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1">
                          <svg
                            className="w-3 h-3 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {formatDuration(service.duration)}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    {/* Features count */}
                    <td className="px-6 py-4">
                      {(service.total_features ?? 0) > 0 ? (
                        <span className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1">
                          {service.total_features} mục
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          service.is_active
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-gray-700/50 text-gray-500 border border-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            service.is_active ? "bg-green-400" : "bg-gray-500"
                          }`}
                        />
                        {service.is_active ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget(service)}
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
              Tổng <span className="text-white">{total}</span> dịch vụ
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

      <ServiceModal
        key={editTarget?.id ?? "new"}
        open={showModal}
        onClose={closeModal}
        onSave={handleSubmit}
        editTarget={editTarget}
        form={form}
        setForm={setForm}
        saving={submitting}
        categories={categories}
        locations={locations}
      />

      <DeleteDialog
        target={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}
