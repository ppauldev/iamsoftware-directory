'use client';

import { useState, useEffect } from 'react';
import { Company, Category, Tag } from '@/lib/graphql-client';
import { FilterOptions, defaultFilterOptions, getAllCategories } from '@/lib/filter-utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, X, Plus, Minus, RotateCcw } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
} from '@/components/ui/accordion';

// Define the global window interface
declare global {
  interface Window {
    __filterOptions?: {
      current: FilterOptions;
      onChange: (options: FilterOptions) => void;
    };
  }
}

interface FilterSidebarProps {
  companies: Company[];
}

// Helper function to get tags by category
function getTagsByCategory(companies: Company[]): Map<string, Tag[]> {
  const tagsByCategoryMap = new Map<string, Map<string, Tag>>();

  // First, collect all tags by category
  companies.forEach(company => {
    company.categories.forEach(category => {
      if (!tagsByCategoryMap.has(category.id)) {
        tagsByCategoryMap.set(category.id, new Map<string, Tag>());
      }

      // Associate tags with this category if the company has both
      company.tags.forEach(tag => {
        const categoryTagsMap = tagsByCategoryMap.get(category.id);
        if (categoryTagsMap && !categoryTagsMap.has(tag.id)) {
          categoryTagsMap.set(tag.id, tag);
        }
      });
    });
  });

  // Convert Maps to arrays
  const result = new Map<string, Tag[]>();
  tagsByCategoryMap.forEach((tagsMap, categoryId) => {
    result.set(categoryId, Array.from(tagsMap.values()));
  });

  return result;
}

export function FilterSidebar({ companies }: FilterSidebarProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsByCategory, setTagsByCategory] = useState<Map<string, Tag[]>>(new Map());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Extract all unique categories and tags from companies
  useEffect(() => {
    setCategories(getAllCategories(companies));
    setTagsByCategory(getTagsByCategory(companies));
  }, [companies]);

  // Update filter options when changed
  useEffect(() => {
    // Get filter options from window if available (set by CompanyGrid)
    if (typeof window !== 'undefined' && window.__filterOptions) {
      const globalFilterOptions = window.__filterOptions;

      // Update global filter options when local options change
      if (globalFilterOptions.onChange) {
        globalFilterOptions.onChange(filterOptions);
      }
    }
  }, [filterOptions]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions((prev) => ({
      ...prev,
      searchTerm: e.target.value,
    }));
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilterOptions((prev) => {
      const selectedCategories = checked
        ? [...prev.selectedCategories, categoryId]
        : prev.selectedCategories.filter((id) => id !== categoryId);

      // If unchecking a category, also unselect all its tags
      let selectedTags = [...prev.selectedTags];
      if (!checked) {
        const categoryTags = tagsByCategory.get(categoryId) || [];
        const categoryTagIds = categoryTags.map(tag => tag.id);
        selectedTags = selectedTags.filter(tagId => !categoryTagIds.includes(tagId));
      }

      return {
        ...prev,
        selectedCategories,
        selectedTags
      };
    });

    // Auto-expand the category when checked
    if (checked) {
      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        newSet.add(categoryId);
        return newSet;
      });
    } else {
      // Auto-collapse immediately when category is unselected
      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  // Handle tag checkbox change
  const handleTagChange = (tagId: string, checked: boolean, categoryId: string) => {
    setFilterOptions((prev) => {
      const selectedTags = checked
        ? [...prev.selectedTags, tagId]
        : prev.selectedTags.filter((id) => id !== tagId);

      const selectedCategories = [...prev.selectedCategories];

      // Auto-check parent category when a tag is selected, but never uncheck it
      if (checked && !selectedCategories.includes(categoryId)) {
        selectedCategories.push(categoryId);
      }

      return {
        ...prev,
        selectedTags,
        selectedCategories
      };
    });
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle rating slider change
  const handleRatingChange = (value: number[]) => {
    setFilterOptions((prev) => ({
      ...prev,
      minRating: value[0],
    }));
  };

  // Reset all filters
  const handleReset = () => {
    setFilterOptions(defaultFilterOptions);
    // Collapse all category menus
    setExpandedCategories(new Set());
  };

  return (
    <div className="space-y-6 border rounded-lg p-6 bg-card shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Filters</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={
              filterOptions.searchTerm === '' &&
              filterOptions.selectedCategories.length === 0 &&
              filterOptions.selectedTags.length === 0 &&
              filterOptions.minRating === 0
            }
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Reset Filters
          </Button>
        </div>

        <div className="space-y-5">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search companies..."
                className="pl-9 bg-background"
                value={filterOptions.searchTerm}
                onChange={handleSearchChange}
              />
              {filterOptions.searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1.5 h-7 w-7 hover:bg-muted"
                  onClick={() => setFilterOptions((prev) => ({ ...prev, searchTerm: '' }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <Label htmlFor="rating" className="text-sm font-medium">Minimum Rating</Label>
              <span className="text-sm text-muted-foreground">
                {filterOptions.minRating === 0 ? 'Any' : filterOptions.minRating}
              </span>
            </div>
            <Slider
              id="rating"
              min={0}
              max={5}
              step={1}
              value={[filterOptions.minRating]}
              onValueChange={handleRatingChange}
              className="py-2"
            />
          </div>

          {/* Categories with nested Tags */}
          {categories.length > 0 && (
            <div className="space-y-3 pt-2 border-t">
              <Label className="text-sm font-medium">Categories & Tags</Label>
              <div className="max-h-80 overflow-y-auto pr-2">
                <Accordion type="multiple" className="space-y-1">
                  {categories.map((category) => {
                    const categoryTags = tagsByCategory.get(category.id) || [];
                    const isExpanded = expandedCategories.has(category.id);

                    return (
                      <AccordionItem
                        key={category.id}
                        value={category.id}
                        className="border px-2 rounded-md mb-1 data-[state=open]:bg-muted/30"
                      >
                        <div className="flex items-center py-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={filterOptions.selectedCategories.includes(category.id)}
                            onCheckedChange={(checked: boolean | 'indeterminate') =>
                              handleCategoryChange(category.id, checked === true)
                            }
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-2"
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium cursor-pointer flex-1"
                          >
                            {category.name}
                          </Label>

                          {categoryTags.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => toggleCategoryExpansion(category.id)}
                            >
                              {isExpanded ?
                                <Minus className="h-3.5 w-3.5" /> :
                                <Plus className="h-3.5 w-3.5" />
                              }
                            </Button>
                          )}
                        </div>

                        {categoryTags.length > 0 && isExpanded && (
                          <div className="pl-6 pb-2 space-y-2">
                            {categoryTags.map((tag) => (
                              <div key={tag.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tag-${tag.id}`}
                                  checked={filterOptions.selectedTags.includes(tag.id)}
                                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                                    handleTagChange(tag.id, checked === true, category.id)
                                  }
                                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                                <Label
                                  htmlFor={`tag-${tag.id}`}
                                  className="text-sm font-normal cursor-pointer leading-tight"
                                >
                                  {tag.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}