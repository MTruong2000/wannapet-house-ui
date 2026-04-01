"use client";

import { useState } from "react";

type Service = {
  id: number;
  name: string;
  price: string;
  status: "active" | "inactive";
};

const INITIAL_DATA: Service[] = [
  { id: 1, name: "Tắm & Cắt tỉa lông", price: "150.000đ", status: "active" },
  { id: 2, name: "Khám sức khoẻ định kỳ", price: "200.000đ", status: "active" },
  { id: 3, name: "Lưu trú theo ngày", price: "300.000đ", status: "inactive" },
  { id: 4, name: "Huấn luyện cơ bản", price: "500.000đ", status: "active" },
];

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [services] = useState<Service[]>(INITIAL_DATA);

  const activeCount = services.filter((s) => s.status === "active").length;

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Tổng dịch vụ"
          value={services.length}
          color="text-white"
        />
        <StatCard
          label="Đang hoạt động"
          value={activeCount}
          color="text-green-400"
        />
        <StatCard
          label="Tạm dừng"
          value={services.length - activeCount}
          color="text-gray-400"
        />
        <StatCard label="Đặt lịch hôm nay" value={12} color="text-amber-400" />
      </div>
    </>
  );
}
