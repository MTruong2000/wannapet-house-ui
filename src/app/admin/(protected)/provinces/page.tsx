"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/admin/toast";

const API = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/admin";

type Province = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

type PaginatedResponse = {
  data: Province[];
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

function Modal({
  open,
  onClose,
  onSave,
  initial,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; slug: string }) => void;
  initial?: Province | null;
  saving: boolean;
}) {
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
  }));
  const [slugManual, setSlugManual] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-white font-semibold text-base mb-5">
          {initial ? "Chỉnh sửa tỉnh thành" : "Thêm tỉnh thành mới"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Tên tỉnh thành <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.name}
              onChange={(e) => {
                const val = e.target.value;
                setForm((f) => ({
                  name: val,
                  slug: slugManual ? f.slug : toSlug(val),
                }));
              }}
              placeholder="VD: Hồ Chí Minh"
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
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              placeholder="vd: ho-chi-minh"
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
            onClick={() => {
              if (form.name.trim()) onSave(form);
            }}
            disabled={saving || !form.name.trim()}
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

export default function ProvincesPage() {
  const [result, setResult] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Province | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async (s: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/provinces?search=${encodeURIComponent(
          s
        )}&page=${p}&limit=${PAGE_SIZE}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error("Không thể tải danh sách tỉnh thành");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(search, page), 300);
    return () => clearTimeout(timer);
  }, [search, page, fetchData]);

  const handleSave = async (form: { name: string; slug: string }) => {
    setSaving(true);
    try {
      const url = editItem
        ? `${API}/provinces/${editItem.id}`
        : `${API}/provinces`;
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      const res = await fetch(`${API}/provinces/${deleteId}`, {
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

  const provinces = result?.data ?? [];
  const totalPages = result?.total_pages ?? 1;

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 gap-4">
          <h2 className="text-white font-semibold text-sm shrink-0">
            Danh sách tỉnh thành
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
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
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
                {["#", "Tên tỉnh thành", "Slug", "Ngày tạo", "Thao tác"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 ${
                        i === 4 ? "text-right" : "text-left"
                      } ${i === 0 ? "w-10" : ""}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div
                          className="h-4 bg-gray-800 rounded animate-pulse"
                          style={{ width: j === 4 ? "80px" : "100%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : provinces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-sm">
                        {search
                          ? "Không tìm thấy kết quả nào."
                          : "Chưa có tỉnh thành nào."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                provinces.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                        {item.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {item.created_at.split("T")[0]}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditItem({ ...item });
                            setModalOpen(true);
                          }}
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

      <Modal
        key={editItem?.id || "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editItem}
        saving={saving}
      />

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
                <h3 className="text-white font-semibold text-sm">
                  Xác nhận xoá
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
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
