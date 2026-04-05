"use client";

import { useState } from "react";
import {
  UsersHeader,
  UsersTable,
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type User,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/features/admin";
import { UserFormDialog } from "@/features/admin/components/users/UserFormDialog";
import { DeleteUserDialog } from "@/features/admin/components/users/DeleteUserForm";
import { AdminPagination } from "@/features/admin/components/shared/AdminPagination";

const LIMIT = 10;

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { data: usersData, isLoading, error } = useUsers(page, LIMIT);
  const users = usersData?.items ?? [];
  const totalPages = usersData?.totalPages ?? 1;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleAddUser = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u._id === userId) ?? null;
    setDeletingUser(user);
    setDeleteOpen(true);
  };

  const handleSubmitCreate = async (input: CreateUserInput) => {
    await createUserMutation.mutateAsync(input);
    setFormOpen(false);
  };

  const handleSubmitUpdate = async (userId: string, input: UpdateUserInput) => {
    await updateUserMutation.mutateAsync({ userId, input });
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    await deleteUserMutation.mutateAsync(deletingUser._id);
    setDeleteOpen(false);
    setDeletingUser(null);
  };

  const isMutating =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    deleteUserMutation.isPending;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(255,248,237,0.88)_0%,rgba(255,255,255,1)_22%,rgba(247,248,252,1)_100%)] text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <UsersHeader users={users} onAddUser={handleAddUser} />

        <UsersTable
          users={users}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          isLoading={isLoading}
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Lỗi khi tải dữ liệu người dùng. Vui lòng thử lại.
          </div>
        )}
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editingUser={editingUser}
        onSubmitCreate={handleSubmitCreate}
        onSubmitUpdate={handleSubmitUpdate}
        isLoading={isMutating}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={deletingUser}
        onConfirm={handleConfirmDelete}
        isLoading={deleteUserMutation.isPending}
      />
    </main>
  );
}
