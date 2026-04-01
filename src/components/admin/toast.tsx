"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning";

export type ToastData = {
  id: string;
  message: string;
  type: ToastType;
};

type Listener = (toast: ToastData) => void;
const listeners: Listener[] = [];

export const toast = {
  show(message: string, type: ToastType = "success") {
    const data: ToastData = { id: crypto.randomUUID(), message, type };
    listeners.forEach((fn) => fn(data));
  },
  success: (msg: string) => toast.show(msg, "success"),
  error: (msg: string) => toast.show(msg, "error"),
  warning: (msg: string) => toast.show(msg, "warning"),
};

const ICONS = {
  success: (
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  error: (
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
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
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
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  ),
};

const STYLES = {
  success: "bg-green-500/10 border-green-500/30 text-green-400",
  error: "bg-red-500/10 border-red-500/30 text-red-400",
  warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
};

function ToastItem({
  toast: t,
  onRemove,
}: {
  toast: ToastData;
  onRemove: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(onRemove, 300);
      return () => clearTimeout(t);
    }
  }, [visible, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm transition-all duration-300 backdrop-blur-sm
      ${STYLES[t.type]}
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
    `}
    >
      {ICONS[t.type]}
      <span>{t.message}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-2 opacity-60 hover:opacity-100"
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
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handler = (t: ToastData) => setToasts((prev) => [...prev, t]);
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onRemove={() =>
            setToasts((prev) => prev.filter((x) => x.id !== t.id))
          }
        />
      ))}
    </div>
  );
}
