import { prisma } from '@/lib/prisma';
import AdminWebsitesClient from './client';

export default async function AdminWebsitesPage() {
  const websites = await prisma.website.findMany({
    include: {
      category: true,
      owner: {
        select: {
          name: true
        }
      },
      tags: true,
      _count: {
        select: {
          ratings: true,
          reviews: true
        }
      }
    },
    orderBy: [
      { approved: 'asc' },  // Show unapproved first
      { createdAt: 'desc' } // Then by date
    ]
  });

  return <AdminWebsitesClient websites={websites} />;
} 