import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { url, name, description, categoryId, tags } = json;

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
        approved: false,
        ownerId: demoUser.id,
        tags: {
          connect: tags.map((id: string) => ({ id })),
        },
      },
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