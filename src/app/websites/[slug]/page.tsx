import { notFound } from 'next/navigation';

export default async function WebsiteDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const website = await prisma.website.findUnique({
    where: {
      slug: params.slug,
      tier: 2,
      approved: true
    },
    include: {
      category: true,
      tags: true,
      _count: {
        select: { ratings: true, reviews: true }
      }
    }
  });

  if (!website) {
    notFound();
  }

  // ... rest of the component
} 