export type PersistedReview = {
  id: string;
  name: string;
  rating: number;
  review: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

const STORAGE_KEY = "gujranwala-cables-reviews";

export const defaultReviews: PersistedReview[] = [
  {
    id: "rev-1",
    name: "Ayesha Traders",
    rating: 5,
    review: "Good branded stock and quick response for shop supply.",
    status: "Pending",
    createdAt: "2026-07-07",
  },
  {
    id: "rev-2",
    name: "M. Usman",
    rating: 5,
    review: "Reliable product guidance and fair dealing.",
    status: "Approved",
    createdAt: "2026-07-06",
  },
  {
    id: "rev-3",
    name: "Sialkot Electric",
    rating: 3,
    review: "Review needs follow-up before publishing.",
    status: "Rejected",
    createdAt: "2026-07-05",
  },
];

export function loadReviews(): PersistedReview[] {
  if (typeof window === "undefined") return defaultReviews;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultReviews;

    const parsed = JSON.parse(stored) as PersistedReview[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultReviews;
  } catch {
    return defaultReviews;
  }
}

export function saveReviews(reviews: PersistedReview[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}
