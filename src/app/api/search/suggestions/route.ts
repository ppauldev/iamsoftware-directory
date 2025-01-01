import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const [websites, tags] = await Promise.all([
    prisma.website.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        approved: true,
      },
      take: 3,
      select: {
        id: true,
        name: true,
        description: true,
        category: { select: { name: true } },
      },
    }),
    prisma.tag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: 2,
      select: {
        name: true,
        _count: { select: { websites: true } },
      },
    }),
  ]);

  const suggestions = [
    ...websites.map(w => ({
      id: w.id,
      type: 'website' as const,
      text: w.name,
      subtext: `${w.category.name} • ${w.description}`,
    })),
    ...tags.map(t => ({
      id: t.name,
      type: 'tag' as const,
      text: t.name,
      subtext: `${t._count.websites} websites`,
    })),
  ];

  return NextResponse.json(suggestions);
} 