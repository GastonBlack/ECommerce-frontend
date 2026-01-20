export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export type ProductFilters = {
    categoryId?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: SortOption | null;
    search?: string;
};
