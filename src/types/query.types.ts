export interface ListQueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  search?: string;
}

export interface ListRequestBase {
  page: number;
  limit: number;
  sort?: string;
  fields?: string;
  search?: string;
}

export interface ListOptions {
  page: number;
  limit: number;
  skip: number;
  sortBy: Record<string, 1 | -1>;
  projection?: string;
  filters: Record<string, unknown>;
  search?: string;
}

export interface ListResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListResult<T> {
  data: T[];
  meta: ListResponseMeta;
}

export interface ProductListQueryParams extends ListQueryParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}

export interface ProductListRequest extends ListRequestBase {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}
