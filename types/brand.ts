export type CreateBrandRequest = {
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
};

export type UpdateBrandRequest = Partial<CreateBrandRequest>;

export type BrandListQuery = {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
};
