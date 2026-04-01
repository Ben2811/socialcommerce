export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  status?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
