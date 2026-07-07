export type CreateFaqRequest = {
  question: string;
  answer: string;
  sortOrder?: number;
};

export type UpdateFaqRequest = Partial<CreateFaqRequest>;

export type FaqListQuery = {
  page: number;
  limit: number;
  search?: string;
};
