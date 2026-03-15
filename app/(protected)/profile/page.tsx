"use client";

import { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  Cake,
} from "lucide-react";

// Mock user data - bạn sẽ thay bằng data thật từ database sau
const mockUser = {
  id: "1",
  username: "a.exe",
  fullName: "Nguyễn Văn A",
  email: "nguyen_van_a@exe.com",
  phone: "0123456789",
  address: "987 Đường ABC, Quận 1, TP.HCM",
  birthday: "2000-04-01",
  joinDate: "2026-02-07",
  avatar:
    "https://i.pinimg.com/736x/7b/a0/97/7ba097827c6faafe38f40dc9e104aa9a.jpg",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [editData, setEditData] = useState(mockUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(userData);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    // TODO: Gọi API để lưu thông tin vào database
    alert("Cập nhật thông tin thành công!");
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        setUserData((prev) => ({
          ...prev,
          avatar: newAvatar,
        }));
        setEditData((prev) => ({
          ...prev,
          avatar: newAvatar,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header với gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt={userData.fullName}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-800 shadow-lg bg-white object-cover"
                />
                {isEditing && (
                  <button
                    onClick={handleAvatarClick}
                    type="button"
                    className="absolute bottom-2 right-2 bg-white dark:bg-zinc-700 p-2 rounded-full shadow-lg hover:scale-110 transition-transform hover:bg-blue-50 dark:hover:bg-zinc-600"
                  >
                    <Camera className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.fullName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4" />@{userData.username}
                </p>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                </div>
              )}
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white font-medium pl-6">
                    {userData.email}
                  </p>
                ) : (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                )}
              </div>

              {/* Phone */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Phone className="w-4 h-4" />
                  Số điện thoại
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white font-medium pl-6">
                    {userData.phone}
                  </p>
                ) : (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                )}
              </div>

              {/* Address */}
              <div className="group md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  Địa chỉ
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white font-medium pl-6">
                    {userData.address}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                )}
              </div>

              {/* Birthday */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Cake className="w-4 h-4" />
                  Ngày sinh
                </label>
                <p className="text-gray-900 dark:text-white font-medium pl-6">
                  {new Date(userData.birthday).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Join Date */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  Ngày tham gia
                </label>
                <p className="text-gray-900 dark:text-white font-medium pl-6">
                  {new Date(userData.joinDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
