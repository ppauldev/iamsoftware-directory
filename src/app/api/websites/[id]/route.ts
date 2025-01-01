import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { Website } from '@prisma/client';
import { createSlug } from '@/lib/utils';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.website.delete({
      where: { id: params.id },
    });
    revalidatePath('/admin/websites');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete website' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data = await request.json();

  const website = await prisma.website.update({
    where: { id: params.id },
    data: {
      ...data,
      slug: createSlug(data.name),
      extendedDescription: data.extendedDescription ?? null,
    },
    include: {
      category: true,
      tags: true,
    }
  }) satisfies Website;

  return NextResponse.json(website);
} 