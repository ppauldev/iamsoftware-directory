import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(
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
      { error: 'Failed to reject website' },
      { status: 500 }
    );
  }
} 