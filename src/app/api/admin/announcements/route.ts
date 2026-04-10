import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, body: msgBody, sendTo, shopIds } = body;

    const announcement = await prisma.$transaction(async (tx) => {
      const a = await tx.announcement.create({
        data: {
          title,
          body: msgBody,
          sendTo: sendTo || 'all',
          createdBy: session.userId,
        },
      });

      // If targeted to specific shops, create recipients
      if (sendTo === 'specific' && shopIds?.length) {
        await tx.announcementRecipient.createMany({
          data: shopIds.map((shopId: string) => ({
            announcementId: a.id,
            shopId,
          })),
        });
      } else if (sendTo === 'all') {
        // Create recipients for all active shops
        const shops = await tx.shop.findMany({
          where: { isActive: true },
          select: { id: true },
        });
        await tx.announcementRecipient.createMany({
          data: shops.map((s) => ({
            announcementId: a.id,
            shopId: s.id,
          })),
        });
      }

      return a;
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
