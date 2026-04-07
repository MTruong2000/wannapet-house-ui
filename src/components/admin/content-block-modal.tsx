"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/admin/toast";

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
  is_default: boolean;
  is_active: boolean;
}

interface SelectOption {
  id: string;
  name: string;
}

interface FormState {
  block_key: string;
  title: string;
  intro: string;
  items: ContentBlockItem[];
  location_id: string;
  is_default: boolean;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  block_key: "",
  title: "",
  intro: "",
  items: [],
  location_id: "",
  is_default: false,
  is_active: true,
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/admin";

const inputClass =
  "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder-gray-600";
const labelClass = "block text-sm text-gray-400 mb-1.5";

/* ──────────────────── Items Editor ───────────────────── */
function ItemsEditor({
  items,
  onChange,
}: {
  items: ContentBlockItem[];
  onChange: (items: ContentBlockItem[]) => void;
}) {
  const addItem = () => {
    onChange([...items, { label: "", content: "" }]);
  };

  const updateItem = (
    idx: number,
    field: keyof ContentBlockItem,
    value: string
  ) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= items.length) return;
    const updated = [...items];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-gray-400">
          Nội dung items{" "}
          <span className="text-gray-600 text-xs">({items.length} mục)</span>
        </label>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg px-3 py-1.5 transition-all"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm mục
        </button>
      </div>

      {items.length === 0 ? (
        <div
          onClick={addItem}
          className="border-2 border-dashed border-gray-700 rounded-xl py-6 text-center cursor-pointer hover:border-gray-600 transition-colors group"
        >
          <svg
            className="w-6 h-6 text-gray-600 mx-auto mb-1.5 group-hover:text-gray-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <p className="text-gray-600 text-xs group-hover:text-gray-500 transition-colors">
            Nhấn để thêm mục đầu tiên
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-3 space-y-2"
            >
              {/* Item header */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  Mục #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Di chuyển lên"
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
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Di chuyển xuống"
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
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Xoá mục"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Label */}
              <input
                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-gray-600"
                placeholder="Label (vd: Địa chỉ, Hotline...)"
                value={item.label}
                onChange={(e) => updateItem(idx, "label", e.target.value)}
              />

              {/* Content */}
              <textarea
                rows={2}
                className="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-gray-600 resize-none"
                placeholder="Nội dung..."
                value={item.content}
                onChange={(e) => updateItem(idx, "content", e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────── Modal ───────────────────── */
export default function ContentBlockModal({
  open,
  onClose,
  onSaved,
  editTarget,
  locations,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editTarget: ContentBlock | null;
  locations: SelectOption[];
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  /* ── Populate form when editing ── */
  useEffect(() => {
    if (editTarget) {
      setForm({
        block_key: editTarget.block_key,
        title: editTarget.title,
        intro: editTarget.intro ?? "",
        items: editTarget.items ?? [],
        location_id: editTarget.location_id ?? "",
        is_default: editTarget.is_default,
        is_active: editTarget.is_active,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editTarget]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!form.block_key.trim()) {
      toast.error("Block key là bắt buộc");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Tiêu đề là bắt buộc");
      return;
    }

    // validate items
    for (let i = 0; i < form.items.length; i++) {
      if (!form.items[i].label.trim()) {
        toast.error(`Mục #${i + 1} thiếu label`);
        return;
      }
      if (!form.items[i].content.trim()) {
        toast.error(`Mục #${i + 1} thiếu content`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        block_key: form.block_key.trim(),
        title: form.title.trim(),
        intro: form.intro.trim() || null,
        items: form.items,
        location_id: form.location_id || null,
        is_default: form.is_default,
        is_active: form.is_active,
      };

      const url = editTarget
        ? `${API}/content-blocks/${editTarget.id}`
        : `${API}/content-blocks`;
      const method = editTarget ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message ?? "Lỗi không xác định");
        return;
      }

      toast.success(
        editTarget ? "Cập nhật thành công" : "Tạo content block thành công"
      );
      onSaved();
    } catch {
      toast.error("Lỗi server");
    } finally {
      setSaving(false);
    }
  };

  const canSubmit =
    !saving && form.block_key.trim() !== "" && form.title.trim() !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-base">
              {editTarget ? "Cập nhật content block" : "Tạo content block mới"}
            </h3>
            {editTarget && (
              <p className="text-gray-500 text-xs mt-0.5 font-mono">
                ID: {editTarget.id}
              </p>
            )}
          </div>
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

        <div className="space-y-5">
          {/* Block Key + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Block Key <span className="text-red-400">*</span>
              </label>
              <input
                className={`${inputClass} font-mono`}
                placeholder="vd: about_wannapet_home"
                value={form.block_key}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    block_key: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "_"),
                  }))
                }
              />
              <p className="text-xs text-gray-600 mt-1">
                Chỉ dùng chữ thường, số và dấu gạch dưới
              </p>
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
                <option value="">— Tất cả chi nhánh —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="Nhập tiêu đề block..."
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* Intro */}
          <div>
            <label className={labelClass}>Intro / Mô tả ngắn</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Mô tả ngắn về block này (tuỳ chọn)..."
              value={form.intro}
              onChange={(e) =>
                setForm((f) => ({ ...f, intro: e.target.value }))
              }
            />
          </div>

          {/* Items */}
          <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/20">
            <ItemsEditor
              items={form.items}
              onChange={(items) => setForm((f) => ({ ...f, items }))}
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-1">
            {/* is_default */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() =>
                  setForm((f) => ({ ...f, is_default: !f.is_default }))
                }
                className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                  form.is_default ? "bg-amber-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                    form.is_default ? "left-5" : "left-0.5"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Mặc định
                </p>
                <p className="text-xs text-gray-600">
                  Block mặc định cho nhóm này
                </p>
              </div>
            </label>

            {/* is_active */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() =>
                  setForm((f) => ({ ...f, is_active: !f.is_active }))
                }
                className={`relative w-10 h-5 rounded-full transition-all duration-200 ${
                  form.is_active ? "bg-green-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                    form.is_active ? "left-5" : "left-0.5"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Đang hiển thị
                </p>
                <p className="text-xs text-gray-600">
                  Hiển thị block này trên website
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
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
            {editTarget ? "Cập nhật" : "Tạo block"}
          </button>
        </div>
      </div>
    </div>
  );
}
