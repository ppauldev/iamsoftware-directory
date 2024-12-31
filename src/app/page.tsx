import { FeaturedWebsites } from "@/components/FeaturedWebsites";
import { SearchBar } from "@/components/SearchBar";
import { CategoryGrid } from "@/components/CategoryGrid";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Discover Amazing Websites
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your curated directory of the best websites across the internet
        </p>
        <SearchBar />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Websites</h2>
        <FeaturedWebsites />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
        <CategoryGrid />
      </section>
    </div>
  );
} 