import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const playerId = searchParams.get('id');
    const gamertagSearchTerm = searchParams.get('searchTerm');

    try {
        if (playerId) {
            // TODO 
            return NextResponse.json({ error: 'Not Implemented' }, { status: 501 });
        } else if(gamertagSearchTerm) {
            const gamerTags = await prisma.startgg_gamertags.findMany({
                where: {
                    gamertag: {
                        contains: gamertagSearchTerm, 
                        mode: 'insensitive', 
                    },
                },
                select: {
                    gamertag: true,
                    startgg_id: true,
                },
            });

            return NextResponse.json(gamerTags, { status: 200 });
        }
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}