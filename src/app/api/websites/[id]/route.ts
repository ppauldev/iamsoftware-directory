import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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
  try {
    const body = await request.json();
    const { tags, ...data } = body;

    const website = await prisma.website.update({
      where: { id: params.id },
      data: {
        ...data,
        tags: {
          set: [], // First disconnect all existing tags
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag }
          }))
        }
      },
      include: {
        category: true,
        owner: {
          select: { name: true }
        },
        tags: true
      }
    });

    revalidatePath('/admin/websites');
    return NextResponse.json(website);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update website' },
      { status: 500 }
    );
  }
} 