import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { standupId, userId, content } = await request.json();

    if (!standupId || !userId || !content) {
      return NextResponse.json({ error: 'Missing required comment fields' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        standupId,
        userId,
        content,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
