"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/admin/toast";

const API = "/api/admin";

type Province = { id: string; name: string };

type Location = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  google_map_embed_url: string | null;
  province_id: string | null;
  province_name: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
};

type PaginatedResponse = {
  data: Location[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

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

type FormState = {
  name: string;
  slug: string;
  address: string;
  phone: string;
  google_map_embed_url: string;
  province_id: string;
  is_default: boolean;
  is_active: boolean;
};

function Modal({
  onClose,
  onSave,
  initial,
  saving,
  provinces,
}: {
  onClose: () => void;
  onSave: (data: FormState) => void;
  initial?: Location | null;
  saving: boolean;
  provinces: Province[];
}) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    google_map_embed_url: initial?.google_map_embed_url ?? "",
    province_id: initial?.province_id ?? "",
    is_default: initial?.is_default ?? false,
    is_active: initial?.is_active ?? true,
  });
  const [slugManual, setSlugManual] = useState(false);

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-white font-semibold text-base mb-5">
          {initial ? "Chỉnh sửa cơ sở" : "Thêm cơ sở mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Tên cơ sở <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.name}
              onChange={(e) => {
                const val = e.target.value;
                setForm((f) => ({
                  ...f,
                  name: val,
                  slug: slugManual ? f.slug : toSlug(val),
                }));
              }}
              placeholder="VD: WannaPet House Quận 1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Slug <span className="text-gray-600 text-xs">(tự động tạo)</span>
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                set("slug", e.target.value);
              }}
              placeholder="vd: wannapet-house-quan-1"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Tỉnh thành
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.province_id}
              onChange={(e) => set("province_id", e.target.value)}
            >
              <option value="">-- Chọn tỉnh thành --</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Địa chỉ
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="VD: 123 Nguyễn Trãi, P.2, Q.5"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Số điện thoại
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="VD: 0901 234 567"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Link nhúng Google Map
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.google_map_embed_url}
              onChange={(e) => set("google_map_embed_url", e.target.value)}
              placeholder="VD: https://www.google.com/maps?q=...&z=16&output=embed"
            />
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Dán link embed Google Map để hiển thị bản đồ ở footer/location
              detail.
            </p>
          </div>

          {form.google_map_embed_url.trim() && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Xem trước bản đồ
              </label>
              <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
                <iframe
                  src={form.google_map_embed_url}
                  className="w-full h-64"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Preview Google Map"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm text-gray-300">Cơ sở mặc định</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Hiển thị mặc định trên web
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("is_default", !form.is_default)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.is_default ? "bg-amber-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.is_default ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-300">Trạng thái hoạt động</span>
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.is_active ? "bg-amber-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
            onClick={() => {
              if (form.name.trim() && form.slug.trim()) onSave(form);
            }}
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
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 20;

export default function BranchesPage() {
  const [result, setResult] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [provinces, setProvinces] = useState<Province[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [editItem, setEditItem] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`${API}/provinces?limit=200`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProvinces(d.data ?? []))
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async (s: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/locations?search=${encodeURIComponent(
          s
        )}&page=${p}&limit=${PAGE_SIZE}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      toast.error("Không thể tải danh sách cơ sở");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search, page), 300);
    return () => clearTimeout(t);
  }, [search, page, fetchData]);

  const openModal = (item: Location | null) => {
    setEditItem(item);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleSave = async (form: FormState) => {
    setSaving(true);
    try {
      const url = editItem
        ? `${API}/locations/${editItem.id}`
        : `${API}/locations`;
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          address: form.address || null,
          phone: form.phone || null,
          google_map_embed_url: form.google_map_embed_url || null,
          province_id: form.province_id || null,
          is_default: form.is_default,
          is_active: form.is_active,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(editItem ? "Cập nhật thành công" : "Thêm mới thành công");
      setModalOpen(false);
      fetchData(search, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const res = await fetch(`${API}/locations/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Xoá thành công");
      setDeleteId(null);

      if (result?.data.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchData(search, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setDeleting(false);
    }
  };

  const items = result?.data ?? [];
  const totalPages = result?.total_pages ?? 1;

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 gap-4">
          <h2 className="text-white font-semibold text-sm shrink-0">
            Danh sách cơ sở / chi nhánh
          </h2>

          <div className="flex items-center gap-3 flex-1 justify-end">
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
                className="bg-gray-800 border border-gray-700 text-white rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all w-48"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <button
              onClick={() => openModal(null)}
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {[
                  "#",
                  "Tên cơ sở",
                  "Tỉnh thành",
                  "Địa chỉ",
                  "SĐT",
                  "Map",
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
              ) : items.length === 0 ? (
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <p className="text-sm">
                        {search
                          ? "Không tìm thấy kết quả nào."
                          : "Chưa có cơ sở nào."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">{item.name}</p>
                        {item.is_default && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-amber-400/70 mt-0.5">
                        {item.slug}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {item.province_name ?? (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-400 text-sm max-w-[220px] truncate">
                      {item.address ?? <span className="text-gray-600">—</span>}
                    </td>

                    <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                      {item.phone ?? <span className="text-gray-600">—</span>}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.google_map_embed_url ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          Đã có
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          item.is_active
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-gray-700/50 text-gray-500 border border-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.is_active ? "bg-green-400" : "bg-gray-500"
                          }`}
                        />
                        {item.is_active ? "Hoạt động" : "Tạm đóng"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal({ ...item })}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
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

          <div className="px-6 py-3 border-t border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Tổng <span className="text-white">{result?.total ?? 0}</span> bản
              ghi
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

      {modalOpen && (
        <Modal
          key={modalKey}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={editItem}
          saving={saving}
          provinces={provinces}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
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
                <h3 className="text-white font-semibold text-base">
                  Xác nhận xoá
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
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
      )}
    </>
  );
}
