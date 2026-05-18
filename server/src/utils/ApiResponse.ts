export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;
  public readonly pagination?: PaginationMeta;

  constructor(data: T, message = 'Success', pagination?: PaginationMeta) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }

  static paginated<T>(
    data: T,
    total: number,
    page: number,
    limit: number,
    message = 'Success',
  ): ApiResponse<T> {
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationMeta = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
    return new ApiResponse<T>(data, message, pagination);
  }
}
