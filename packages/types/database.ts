/** Shared DB record shape — all rows have these fields from TimestampedBase. */
export interface DBRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

/** Generic paginated response envelope from the API. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}
