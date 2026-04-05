"use client";

interface PoliciesHeaderProps {
  onAddNew?: () => void;
}

export function PoliciesHeader({ onAddNew }: PoliciesHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Quy định và chính sách</h1>
      <p className="text-gray-500">Quản lý các quy định và chính sách của công ty</p>
    </div>
  );
}
