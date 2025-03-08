import { MainLayout } from '@/components/layout/main-layout';
import { executeQuery, AllCompaniesResponse } from '@/lib/graphql-client';
import { GET_ALL_COMPANIES } from '@/lib/graphql-queries';
import { CompanyGrid } from '@/components/company/company-grid';
import { FilterSidebar } from '@/components/filter/filter-sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The IAM Directory - Identity and Access Management Software',
  description: 'Find the right Identity and Access Management (IAM) solution for your business. Explore IAM software vendors, features, and services.',
};

export default async function Home() {
  // Fetch companies data
  const data = await executeQuery<AllCompaniesResponse>(GET_ALL_COMPANIES);
  const companies = data.companies || [];

  return (
    <MainLayout maxWidth="wide">
      <div>
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 tracking-tight">
            The IAM Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find the right Identity and Access Management solution for your business.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/5 lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar companies={companies} />
          </aside>

          <div className="w-full lg:w-4/5">
            <CompanyGrid companies={companies} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
