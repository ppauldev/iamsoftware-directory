import { Company, Category, Tag } from './graphql-client';

export interface FilterOptions {
  searchTerm: string;
  selectedCategories: string[];
  selectedTags: string[];
  minRating: number;
}

// Default filter options
export const defaultFilterOptions: FilterOptions = {
  searchTerm: '',
  selectedCategories: [],
  selectedTags: [],
  minRating: 0,
};

// Filter companies based on filter options
export function filterCompanies(companies: Company[], filterOptions: FilterOptions): Company[] {
  const { searchTerm, selectedCategories, selectedTags, minRating } = filterOptions;

  return companies.filter((company) => {
    // Filter by search term
    const matchesSearchTerm = searchTerm.trim() === '' ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by categories
    const matchesCategories = selectedCategories.length === 0 ||
      company.categories.some(category => selectedCategories.includes(category.id));

    // Filter by tags
    const matchesTags = selectedTags.length === 0 ||
      company.tags.some(tag => selectedTags.includes(tag.id));

    // Filter by rating
    const matchesRating = minRating === 0 ||
      (company.rating !== undefined && company.rating >= minRating);

    return matchesSearchTerm && matchesCategories && matchesTags && matchesRating;
  });
}

// Get all unique categories from companies
export function getAllCategories(companies: Company[]): Category[] {
  const categoriesMap = new Map<string, Category>();
  const categoryCounts = new Map<string, number>();

  companies.forEach(company => {
    company.categories.forEach(category => {
      if (!categoriesMap.has(category.id)) {
        categoriesMap.set(category.id, category);
        categoryCounts.set(category.id, 1);
      } else {
        categoryCounts.set(category.id, (categoryCounts.get(category.id) || 0) + 1);
      }
    });
  });

  // Only return categories that are associated with at least one company
  return Array.from(categoriesMap.values())
    .filter(category => (categoryCounts.get(category.id) || 0) > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get all unique tags from companies
export function getAllTags(companies: Company[]): Tag[] {
  const tagsMap = new Map<string, Tag>();
  const tagCounts = new Map<string, number>();

  companies.forEach(company => {
    company.tags.forEach(tag => {
      if (!tagsMap.has(tag.id)) {
        tagsMap.set(tag.id, tag);
        tagCounts.set(tag.id, 1);
      } else {
        tagCounts.set(tag.id, (tagCounts.get(tag.id) || 0) + 1);
      }
    });
  });

  // Only return tags that are associated with at least one company
  return Array.from(tagsMap.values())
    .filter(tag => (tagCounts.get(tag.id) || 0) > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Pagination utility
export function paginateItems<T>(items: T[], currentPage: number, itemsPerPage: number): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
}

// Calculate total number of pages
export function getTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
} 