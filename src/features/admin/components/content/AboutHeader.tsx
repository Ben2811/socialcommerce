"use client";

interface AboutHeaderProps {
  onEdit?: () => void;
  isEditing?: boolean;
}

export function AboutHeader({ onEdit, isEditing }: AboutHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Về chúng tôi</h1>
        <p className="text-gray-500">Quản lý nội dung giới thiệu về công ty</p>
      </div>
    </div>
  );
}
