"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "@/components/admin/toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  parent_name: string | null;
  is_active: boolean;
  created_at: string;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface PaginatedResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface FormState {
  name: string;
  slug: string;
  parent_id: string;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  parent_id: "",
  is_active: true,
};
const API = "http://localhost:2906/api/admin";
const LIMIT = 10;

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
  editTarget,
  form,
  setForm,
  saving,
  parentOptions,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  editTarget: Category | null;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  saving: boolean;
  parentOptions: CategoryOption[];
}) {
  if (!open) return null;

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: editTarget ? f.slug : toSlug(val),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-base">
            {editTarget ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm"}
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
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Tên loại <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-gray-600"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="VD: Thức ăn cho chó"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Slug <span className="text-gray-600 text-xs">(tự động tạo)</span>
            </label>
            <input
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono placeholder-gray-600"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="thuc-an-cho-cho"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Danh mục cha
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={form.parent_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, parent_id: e.target.value }))
              }
            >
              <option value="">— Không có —</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-300">Hiển thị</span>
            <button
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, is_active: !f.is_active }))
              }
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

function DeleteDialog({
  target,
  onCancel,
  onConfirm,
  deleting,
}: {
  target: Category | null;
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
              Xoá loại{" "}
              <span className="text-white font-medium">&quot;{target.name}&quot;</span>?{" "}
              Hành động này không thể hoàn tác.
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: String(page),
        limit: String(LIMIT),
      });
      const res = await fetch(`${API}/categories?${params}`, {
        credentials: "include",
      });
      const json: PaginatedResponse = await res.json();
      setCategories(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.total_pages ?? 1);
    } catch {
      toast.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  const fetchAllCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/categories/all`, {
        credentials: "include",
      });
      const json: CategoryOption[] = await res.json();
      setAllCategories(json ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchCategories(), 300);
    return () => clearTimeout(t);
  }, [fetchCategories]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id ?? "",
      is_active: cat.is_active,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        parent_id: form.parent_id || null,
        is_active: form.is_active,
      };
      const res = await fetch(
        editTarget ? `${API}/categories/${editTarget.id}` : `${API}/categories`,
        {
          method: editTarget ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }
      toast.success(editTarget ? "Cập nhật thành công" : "Thêm thành công");
      closeModal();
      fetchCategories();
      fetchAllCategories();
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
      const res = await fetch(`${API}/categories/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }
      toast.success("Đã xoá danh mục");
      setDeleteTarget(null);
      if (categories.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchCategories();
      fetchAllCategories();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setDeleting(false);
    }
  };

  const parentOptions = allCategories.filter((c) => c.id !== editTarget?.id);

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 gap-4">
          <h2 className="text-white font-semibold text-sm shrink-0">
            Loại sản phẩm
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
                className="bg-gray-800 border border-gray-700 text-white rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all w-48 placeholder-gray-600"
                placeholder="Tìm kiếm..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {[
                  "#",
                  "Tên loại",
                  "Danh mục cha",
                  "Trạng thái",
                  "Thao tác",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 ${
                      i === 4 ? "text-right" : "text-left"
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
              ) : categories.length === 0 ? (
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <p className="text-sm">
                        {search
                          ? "Không tìm thấy kết quả nào."
                          : "Chưa có loại sản phẩm nào."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{cat.name}</p>
                      <p className="text-xs font-mono text-amber-400/70 mt-0.5">
                        {cat.slug}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {cat.parent_name ? (
                        <span className="inline-flex items-center gap-1.5">
                          <svg
                            className="w-3 h-3 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          {cat.parent_name}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          cat.is_active
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-gray-700/50 text-gray-500 border border-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.is_active ? "bg-green-400" : "bg-gray-500"
                          }`}
                        />
                        {cat.is_active ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
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
              Tổng <span className="text-white">{total}</span> bản ghi
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
        key={editTarget?.id ?? "new"}
        open={showModal}
        onClose={closeModal}
        onSave={handleSubmit}
        editTarget={editTarget}
        form={form}
        setForm={setForm}
        saving={submitting}
        parentOptions={parentOptions}
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
