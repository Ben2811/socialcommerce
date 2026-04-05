"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressItem } from "./AddressItem";
import { AddressFormDialog } from "./AddressFormDialog";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "../hooks/useAddress";
import type { Address, CreateAddressInput } from "../types/address.interface";

export function AddressesList() {
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);

  function openAdd() {
    setEditTarget(null);
    setDialogOpen(true);
  }

  function openEdit(address: Address) {
    setEditTarget(address);
    setDialogOpen(true);
  }

  function handleClose() {
    setDialogOpen(false);
    setEditTarget(null);
  }

  async function handleSubmit(data: CreateAddressInput) {
    if (editTarget) {
      await updateAddress.mutateAsync({ id: editTarget._id, input: data });
    } else {
      await addAddress.mutateAsync(data);
    }
    handleClose();
  }

  const isMutating = addAddress.isPending || updateAddress.isPending;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Địa chỉ</h2>
        <Button
          size="sm"
          variant="orange"
          onClick={openAdd}
        >
          <Plus className="h-4 w-4" />
          Thêm địa chỉ mới
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-lg text-muted-foreground">
          <p className="text-sm">Chưa có địa chỉ nào</p>
          <Button
            size="sm"
            variant="orange"
            className="mt-3 rounded-full px-5 text-black border-orange-400 hover:bg-orange-50"
            onClick={openAdd}
          >
            + Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressItem
              key={addr._id}
              address={addr}
              onEdit={openEdit}
              onDelete={(id) => deleteAddress.mutate(id)}
              onSetDefault={(id) => setDefault.mutate(id)}
              isDeleting={deleteAddress.isPending}
              isSettingDefault={setDefault.isPending}
            />
          ))}
          <button
            onClick={openAdd}
            className="w-full mt-1 flex items-center justify-center gap-2 rounded-lg border border-dashed border-orange-300 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </button>
        </div>
      )}

      <AddressFormDialog
        key={`${dialogOpen ? 1 : 0}-${editTarget?._id ?? 'new'}`}
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={isMutating}
        editAddress={editTarget}
      />
    </div>
  );
}
