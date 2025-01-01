import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createSlug } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { url, name, description, categoryId, tags, approved, thumbnail } = json;

    // Basic validation
    if (!url || !name || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create demo user
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'USER',
      },
    });

    // Create the website
    const website = await prisma.website.create({
      data: {
        url,
        name,
        description,
        categoryId,
        approved: approved || false,
        thumbnail: thumbnail || null,
        ownerId: demoUser.id,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        },
        tier: 1,
        slug: createSlug(name),
      },
      include: {
        category: true,
        owner: {
          select: { name: true }
        },
        tags: true
      }
    });

    return NextResponse.json(website);
  } catch (error) {
    console.error('Error creating website:', error);
    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    );
  }
} 