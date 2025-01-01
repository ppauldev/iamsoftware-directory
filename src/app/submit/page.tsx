import { prisma } from '@/lib/prisma';
import { WebsiteSubmissionForm } from '@/components/WebsiteSubmissionForm';

export default async function SubmitPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Submit a Website</h1>
      <div className="max-w-2xl">
        <WebsiteSubmissionForm
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
} 