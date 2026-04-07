"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "@/components/admin/toast";
import ContentBlockModal from "@/components/admin/content-block-modal";

/* ─────────────────────────── Types ─────────────────────────── */
interface ContentBlockItem {
  label: string;
  content: string;
}

interface ContentBlock {
  id: string;
  block_key: string;
  title: string;
  intro: string | null;
  items: ContentBlockItem[];
  location_id: string | null;
  location_name: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: ContentBlock[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

interface SelectOption {
  id: string;
  name: string;
}

const API = "/api/admin";
const LIMIT = 10;

/* ──────────────────────── Delete Dialog ─────────────────────── */
function DeleteDialog({
  target,
  onCancel,
  onConfirm,
  deleting,
}: {
  target: ContentBlock | null;
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
              Xoá block{" "}
              <span className="text-white font-medium">
                &quot;{target.title}&quot;
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

/* ─────────────────────── Detail Drawer ─────────────────────── */
function DetailDrawer({
  block,
  onClose,
  onEdit,
  onDelete,
}: {
  block: ContentBlock | null;
  onClose: () => void;
  onEdit: (b: ContentBlock) => void;
  onDelete: (b: ContentBlock) => void;
}) {
  if (!block) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-gray-900 border-l border-gray-800 h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h3 className="text-white font-semibold text-sm">
            Chi tiết content block
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

        <div className="flex-1 p-6 space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-gray-800 border-gray-700 text-gray-300 font-mono">
              {block.block_key}
            </span>
            {block.is_default && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-amber-500/10 border-amber-500/20 text-amber-400">
                Mặc định
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                block.is_active
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-gray-700/50 border-gray-700 text-gray-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  block.is_active ? "bg-green-400" : "bg-gray-500"
                }`}
              />
              {block.is_active ? "Đang hiển thị" : "Đã ẩn"}
            </span>
          </div>

          {/* Info */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Thông tin
            </p>
            <div>
              <p className="text-white font-semibold text-base">
                {block.title}
              </p>
              {block.intro && (
                <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                  {block.intro}
                </p>
              )}
            </div>
            {block.location_name && (
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1 border-t border-gray-700/50">
                <svg
                  className="w-3.5 h-3.5 text-gray-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {block.location_name}
              </div>
            )}
          </div>

          {/* Items */}
          {block.items && block.items.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Nội dung ({block.items.length} mục)
              </p>
              <div className="space-y-2">
                {block.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3"
                  >
                    <p className="text-amber-400 text-xs font-semibold mb-1">
                      {item.label}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              Tạo lúc:{" "}
              <span className="text-gray-500">
                {new Date(block.created_at).toLocaleString("vi-VN")}
              </span>
            </p>
            <p>
              Cập nhật:{" "}
              <span className="text-gray-500">
                {new Date(block.updated_at).toLocaleString("vi-VN")}
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 flex gap-3">
          <button
            onClick={() => onEdit(block)}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => onDelete(block)}
            className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main Page ─────────────────────────── */
export default function ContentBlocksPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterBlockKey, setFilterBlockKey] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [loading, setLoading] = useState(false);

  const [locations, setLocations] = useState<SelectOption[]>([]);

  const [detailTarget, setDetailTarget] = useState<ContentBlock | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<ContentBlock | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ContentBlock | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Fetch blocks ── */
  const fetchBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        search,
        block_key: filterBlockKey,
      });
      if (filterActive !== "") params.set("is_active", filterActive);

      const res = await fetch(`${API}/content-blocks?${params}`, {
        credentials: "include",
      });
      const json: PaginatedResponse = await res.json();
      setBlocks(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.total_pages ?? 1);
    } catch {
      toast.error("Không thể tải danh sách content block");
    } finally {
      setLoading(false);
    }
  }, [search, filterBlockKey, filterActive, page]);

  /* ── Fetch locations ── */
  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/locations`, { credentials: "include" });
      const json = await res.json();
      setLocations(Array.isArray(json) ? json : json.data ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchBlocks(), 300);
    return () => clearTimeout(t);
  }, [fetchBlocks]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  /* ── Handlers ── */
  const openCreate = () => {
    setEditTarget(null);
    setDetailTarget(null);
    setShowModal(true);
  };

  const openEdit = (b: ContentBlock) => {
    setEditTarget(b);
    setDetailTarget(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
  };

  const handleSaved = () => {
    closeModal();
    fetchBlocks();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/content-blocks/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }
      toast.success("Đã xoá content block");
      setDeleteTarget(null);
      setDetailTarget(null);
      if (blocks.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchBlocks();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilterBlockKey("");
    setFilterActive("");
    setPage(1);
  };

  const hasFilters = search || filterBlockKey || filterActive;

  /* ── Render ── */
  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-800 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-white font-semibold text-sm shrink-0">
              Content Blocks
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
              Tạo block mới
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
                placeholder="Tìm tiêu đề, block key..."
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

            {/* Block key filter */}
            <input
              className="bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all w-44 placeholder-gray-600 font-mono"
              placeholder="block_key..."
              value={filterBlockKey}
              onChange={(e) => {
                setFilterBlockKey(e.target.value);
                setPage(1);
              }}
            />

            {/* Active filter */}
            <select
              className="bg-gray-800 border border-gray-700 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              value={filterActive}
              onChange={(e) => {
                setFilterActive(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hiển thị</option>
              <option value="false">Đã ẩn</option>
            </select>

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
                  "Block Key",
                  "Tiêu đề",
                  "Chi nhánh",
                  "Items",
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
              ) : blocks.length === 0 ? (
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm">
                        {hasFilters
                          ? "Không tìm thấy kết quả nào."
                          : "Chưa có content block nào."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                blocks.map((block, idx) => (
                  <tr
                    key={block.id}
                    className="hover:bg-gray-800/40 transition-colors cursor-pointer"
                    onClick={() => setDetailTarget(block)}
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * LIMIT + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-lg px-2 py-1 font-mono">
                        {block.block_key}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium leading-tight">
                          {block.title}
                        </p>
                        {block.intro && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {block.intro}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {block.location_name ? (
                        <span className="flex items-center gap-1.5">
                          <svg
                            className="w-3 h-3 text-gray-600 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          {block.location_name}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs italic">
                          Tất cả chi nhánh
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {block.items?.length ?? 0} mục
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {block.is_default && (
                          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            Mặc định
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                            block.is_active
                              ? "bg-green-500/10 border-green-500/20 text-green-400"
                              : "bg-gray-700/50 border-gray-700 text-gray-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              block.is_active ? "bg-green-400" : "bg-gray-500"
                            }`}
                          />
                          {block.is_active ? "Hiển thị" : "Ẩn"}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(block)}
                          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setDeleteTarget(block)}
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
              Tổng <span className="text-white">{total}</span> content block
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
        block={detailTarget}
        onClose={() => setDetailTarget(null)}
        onEdit={openEdit}
        onDelete={(b) => {
          setDeleteTarget(b);
          setDetailTarget(null);
        }}
      />

      {/* Create/Edit Modal */}
      <ContentBlockModal
        key={editTarget?.id ?? "new"}
        open={showModal}
        onClose={closeModal}
        onSaved={handleSaved}
        editTarget={editTarget}
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
