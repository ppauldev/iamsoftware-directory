'use client';

import { useState } from 'react';
import { Company } from '@/lib/graphql-client';
import { filterCompanies, paginateItems, getTotalPages, FilterOptions, defaultFilterOptions } from '@/lib/filter-utils';
import { CompanyTile } from './company-tile';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the global window interface
declare global {
  interface Window {
    __filterOptions?: {
      current: FilterOptions;
      onChange: (options: FilterOptions) => void;
    };
  }
}

interface CompanyGridProps {
  companies: Company[];
}

export function CompanyGrid({ companies }: CompanyGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);

  // Apply filters
  const filteredCompanies = filterCompanies(companies, filterOptions);

  // Apply pagination
  const paginatedCompanies = paginateItems(filteredCompanies, currentPage, itemsPerPage);
  const totalPages = getTotalPages(filteredCompanies.length, itemsPerPage);

  // Handle filter changes from sidebar
  const handleFilterChange = (newFilterOptions: FilterOptions) => {
    setFilterOptions(newFilterOptions);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Make filter options available to parent components
  if (typeof window !== 'undefined') {
    window.__filterOptions = {
      current: filterOptions,
      onChange: handleFilterChange,
    };
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-sm">
          Showing <span className="font-medium">{filteredCompanies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredCompanies.length)}</span> of <span className="font-medium">{filteredCompanies.length}</span> companies
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Show:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value: string) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px] h-9 bg-background">
              <SelectValue placeholder="20" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedCompanies.map((company) => (
            <CompanyTile key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border rounded-lg bg-card">
          <p className="text-lg font-medium">No companies found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
} 