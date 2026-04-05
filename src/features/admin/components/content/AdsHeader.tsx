"use client";

interface AdsHeaderProps {
  onAddNew?: () => void;
}

export function AdsHeader({ onAddNew }: AdsHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Quảng cáo</h1>
      <p className="text-gray-500">Quản lý các quảng cáo trên hệ thống</p>
    </div>
  );
}
