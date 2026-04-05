"use client";

import { useRef } from "react";
import { Upload, MoreVertical, Trash2, Star } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageIcon } from "lucide-react";

interface ProfileImagesProps {
  displayImages: string[];
  isEditing: boolean;
  uploading: boolean;
  onFileUpload: (file: File) => void;
  onRemoveImage: (index: number) => void;
  onSetAsAvatar: (index: number) => void;
}

export function ProfileImages({
  displayImages,
  isEditing,
  uploading,
  onFileUpload,
  onRemoveImage,
  onSetAsAvatar,
}: ProfileImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Hình ảnh</CardTitle>
          </div>
          {isEditing && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Đang tải..." : "Tải ảnh lên"}
              </Button>
            </>
          )}
        </div>
        <CardDescription>Ảnh đầu tiên sẽ được dùng làm avatar.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {displayImages.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {isEditing
              ? 'Chưa có ảnh nào. Nhấn "Tải ảnh lên" để thêm.'
              : "Chưa có hình ảnh nào."}
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {displayImages.map((url, i) => (
              <div
                key={url + i}
                className="relative group aspect-square rounded-xl overflow-hidden border bg-muted"
              >
                <img
                  src={url}
                  alt={"Ảnh " + (i + 1)}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full z-10">
                    Avatar
                  </span>
                )}
                {isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="absolute top-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm hover:bg-black/40 transition-colors z-10">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {i === 0 ? (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">
                          Đây là avatar hiện tại
                        </div>
                      ) : (
                        <DropdownMenuItem onClick={() => onSetAsAvatar(i)}>
                          <Star className="w-4 h-4 mr-2" />
                          <span>Đặt làm avatar</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onRemoveImage(i)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>Xóa ảnh</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
