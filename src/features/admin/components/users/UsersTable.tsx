"use client";

import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersActions } from "./UsersActions";
import type { User } from "../../types/user";

interface UsersTableProps {
  users: User[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  isLoading?: boolean;
}

export function UsersTable({
  users,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  isLoading,
}: UsersTableProps) {
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phonenumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <Card className="border-border/70 bg-white shadow-[0_12px_40px_rgba(17,24,39,0.05)]">
      <CardHeader className="border-b border-border/60 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription className="mt-1">
              {filteredUsers.length} người dùng được tìm thấy
            </CardDescription>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 py-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Đang tải dữ liệu...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Không tìm thấy người dùng</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-4">Tên người dùng</TableHead>
                  <TableHead className="px-6 py-4">Email</TableHead>
                  <TableHead className="px-6 py-4">Số điện thoại</TableHead>
                  <TableHead className="px-6 py-4">Địa chỉ</TableHead>
                  <TableHead className="px-6 py-4 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className="border-border/40 hover:bg-[#fafafa]"
                  >
                    <TableCell className="px-6 py-4 font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {user.phonenumber || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {user.address || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <UsersActions
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
