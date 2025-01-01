import { prisma } from '@/lib/prisma';
import AdminWebsitesClient from './client';

export default async function AdminWebsitesPage({
  searchParams,
}: {
  searchParams: { sort?: string; q?: string };
}) {
  const { sort = 'status', q } = searchParams;

  const websites = await prisma.website.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { url: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
        { tags: { some: { name: { contains: q, mode: 'insensitive' } } } },
      ]
    } : undefined,
    select: {
      id: true,
      name: true,
      description: true,
      url: true,
      thumbnail: true,
      approved: true,
      tier: true,
      slug: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      owner: {
        select: {
          name: true
        }
      },
      tags: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          ratings: true,
          reviews: true
        }
      }
    },
    orderBy: (() => {
      switch (sort) {
        case 'name':
          return { name: 'asc' };
        case 'newest':
          return { createdAt: 'desc' };
        case 'status':
        default:
          return [
            { approved: 'asc' },
            { createdAt: 'desc' }
          ];
      }
    })(),
  });

  return <AdminWebsitesClient websites={websites} />;
} 