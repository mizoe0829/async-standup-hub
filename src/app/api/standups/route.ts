import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const standups = await prisma.standup.findMany({
      where: { date },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ standups });
  } catch (error) {
    console.error('Error fetching standups:', error);
    return NextResponse.json({ error: 'Failed to fetch standups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, date, yesterday, today, blockers, mood } = body;

    if (!userId || !yesterday || !today) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hasBlocker = Boolean(blockers && blockers.trim().length > 0);
    const postDate = date || new Date().toISOString().split('T')[0];

    const standup = await prisma.standup.upsert({
      where: {
        userId_date: {
          userId,
          date: postDate,
        },
      },
      update: {
        yesterday,
        today,
        blockers: blockers || null,
        hasBlocker,
        mood: mood || 'good',
      },
      create: {
        userId,
        date: postDate,
        yesterday,
        today,
        blockers: blockers || null,
        hasBlocker,
        mood: mood || 'good',
      },
      include: {
        user: true,
        comments: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ standup });
  } catch (error) {
    console.error('Error saving standup:', error);
    return NextResponse.json({ error: 'Failed to save standup' }, { status: 500 });
  }
}
