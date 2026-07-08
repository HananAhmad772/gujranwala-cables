export type CreateCategoryRequest = {
  name: string;
  slug: string;
  description?: string | null;
  isActive?: boolean;
};

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export type CategoryListQuery = {
  page: number;
  limit: number;
  search?: string;
};
