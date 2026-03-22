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

export { CategoriesHeader } from "./components/categories/CategoriesHeader";
export { CategoriesTable } from "./components/categories/CategoriesTable";
export { CategoriesActions } from "./components/categories/CategoriesActions";
export { CategoryFormDialog } from "./components/categories/CategoryFormDialog";
export { DeleteCategoryDialog } from "./components/categories/DeleteCategoryForm";

export { managementItems, contentItems, supportLink, settingsLink } from "./constants/sidebar-menu";
export { USER_COLUMNS } from "./constants/users";
export { PRODUCT_COLUMNS } from "./constants/products";

export { usersAdminService } from "./services/users.service";
export { adminProductsService } from "./services/products.service";
export { adminCategoriesService } from "./services/categories.service";

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

export {
  useAdminCategories,
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from "./hooks/useAdminCategories";

export type { User, UsersResponse, CreateUserInput, UpdateUserInput } from "./types/user";
export type {
  AdminProduct,
  AdminVariant,
  UpdateAdminProductStatusInput,
} from "./types/product";
export type { AdminCategory, CreateCategoryInput, UpdateCategoryInput } from "./types/category";
