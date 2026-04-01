"use client";

import { useState, useEffect } from "react";

type Province = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

const INITIAL_DATA: Province[] = [
  {
    id: "1",
    name: "Hồ Chí Minh",
    slug: "ho-chi-minh",
    created_at: "2024-01-01",
  },
  {
    id: "2",
    name: "Hà Nội",
    slug: "ha-noi",
    created_at: "2024-01-02",
  },
  {
    id: "3",
    name: "Đà Nẵng",
    slug: "da-nang",
    created_at: "2024-01-03",
  },
  {
    id: "4",
    name: "Cần Thơ",
    slug: "can-tho",
    created_at: "2024-01-04",
  },
  {
    id: "5",
    name: "Hải Phòng",
    slug: "hai-phong",
    created_at: "2024-01-05",
  },
  {
    id: "6",
    name: "Bình Dương",
    slug: "binh-duong",
    created_at: "2024-01-06",
  },
  {
    id: "7",
    name: "Đồng Nai",
    slug: "dong-nai",
    created_at: "2024-01-07",
  },
  {
    id: "8",
    name: "Khánh Hòa",
    slug: "khanh-hoa",
    created_at: "2024-01-08",
  },
  {
    id: "9",
    name: "Lâm Đồng",
    slug: "lam-dong",
    created_at: "2024-01-09",
  },
  {
    id: "10",
    name: "Quảng Ninh",
    slug: "quang-ninh",
    created_at: "2024-01-10",
  },
  {
    id: "11",
    name: "Nghệ An",
    slug: "nghe-an",
    created_at: "2024-01-11",
  },
  {
    id: "12",
    name: "Thanh Hóa",
    slug: "thanh-hoa",
    created_at: "2024-01-12",
  },
  {
    id: "13",
    name: "Bắc Ninh",
    slug: "bac-ninh",
    created_at: "2024-01-13",
  },
  {
    id: "14",
    name: "Thừa Thiên Huế",
    slug: "thua-thien-hue",
    created_at: "2024-01-14",
  },
  {
    id: "15",
    name: "An Giang",
    slug: "an-giang",
    created_at: "2024-01-15",
  },
];

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
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Province, "id" | "created_at">) => void;
  initial?: Province | null;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
  });
  const [slugManual, setSlugManual] = useState(false);

  if (!open) return null;

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: slugManual ? f.slug : toSlug(val),
    }));
  };

  const handleSlugChange = (val: string) => {
    setSlugManual(true);
    setForm((f) => ({ ...f, slug: val }));
  };

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
              onChange={(e) => handleNameChange(e.target.value)}
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
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="vd: ho-chi-minh"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              if (!form.name.trim()) return;
              onSave(form);
              onClose();
            }}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState<Province[]>(INITIAL_DATA);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Province | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const filtered = provinces.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Province) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Province, "id" | "created_at">) => {
    if (editItem) {
      setProvinces((s) =>
        s.map((x) => (x.id === editItem.id ? { ...x, ...data } : x))
      );
    } else {
      setProvinces((s) => [
        ...s,
        {
          id: crypto.randomUUID(),
          ...data,
          created_at: new Date().toISOString().split("T")[0],
        },
      ]);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      setProvinces((s) => s.filter((x) => x.id !== deleteId));
      setDeleteId(null);
    }
  };

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, totalPages]);

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
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
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
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 w-10">
                  #
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Tên tỉnh thành
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Slug
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Ngày tạo
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-500 text-sm"
                  >
                    Không tìm thấy kết quả nào.
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
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
                      {item.created_at}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
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
              Hiển thị {paginated.length} / {filtered.length} bản ghi
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
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                    ${
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editItem}
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
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
