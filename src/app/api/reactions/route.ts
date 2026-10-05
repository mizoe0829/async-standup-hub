import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { standupId } = await request.json();

    if (!standupId) {
      return NextResponse.json({ error: 'Missing standupId' }, { status: 400 });
    }

    const updated = await prisma.standup.update({
      where: { id: standupId },
      data: {
        reactions: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ reactions: updated.reactions });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json({ error: 'Failed to react' }, { status: 500 });
  }
}
