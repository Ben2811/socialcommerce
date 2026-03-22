export { AdminSidebar } from "./components/AdminSidebar";
export { UsersHeader } from "./components/users/UsersHeader";
export { UsersTable } from "./components/users/UsersTable";
export { UsersActions } from "./components/users/UsersActions";
export { UserFormDialog } from "./components/users/UserFormDialog";
export { DeleteUserDialog } from "./components/users/DeleteUserForm";

export { ProductsHeader } from "./components/products/ProductsHeader";
export { ProductsTable } from "./components/products/ProductsTable";
export { ProductsActions } from "./components/products/ProductsActions";
export { DeleteProductDialog } from "./components/products/DeleteProductForm";

export { managementItems, contentItems, supportLink, settingsLink } from "./constants/sidebar-menu";
export { USER_COLUMNS } from "./constants/users";
export { PRODUCT_COLUMNS } from "./constants/products";

export { usersAdminService } from "./services/users.service";
export { adminProductsService } from "./services/products.service";

export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/useUsers";

export {
  useAdminProducts,
  useUpdateAdminProductStatus,
  useDeleteAdminProduct,
} from "./hooks/useAdminProducts";

export type { User, UsersResponse, CreateUserInput, UpdateUserInput } from "./types/user";
export type {
  AdminProduct,
  AdminVariant,
  UpdateAdminProductStatusInput,
} from "./types/product";
