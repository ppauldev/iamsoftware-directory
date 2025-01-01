import { prisma } from '@/lib/prisma';

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { websites: true } }
    },
    orderBy: [
      { websites: { _count: 'desc' } },
      { name: 'asc' }
    ]
  });
}