import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

console.log(process.env.DATABASE_URL);
console.log(prisma.DATABASE_URL);

function generateHash(timestamp: string): string {
    return createHash('sha256').update(timestamp).digest('hex').slice(0, 16); // 16-character hash
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const scorekeeperId = searchParams.get('id');

    try {
        if (scorekeeperId) {
            const scorekeeper = await prisma.match_scores.findUnique({
                where: { id: scorekeeperId },
            });

            if (!scorekeeper) {
                return NextResponse.json({ error: 'Scorekeeper not found' }, { status: 404 });
            }

            const result = {
                id: scorekeeper.id,
                name: scorekeeper.name,
                playersInfo: {
                    0: {
                        playerName: scorekeeper.player_one_name || '',
                        playerTag: scorekeeper.player_one_tag || '',
                    },
                    1: {
                        playerName: scorekeeper.player_two_name || '',
                        playerTag: scorekeeper.player_two_tag || '',
                    },
                },
                matchScore: {
                    0: scorekeeper.player_one_score || 0,
                    1: scorekeeper.player_two_score || 0,
                },
                stageFirstTo: scorekeeper.stage_first_to || 0,
                bracketStage: scorekeeper.bracket_stage || '',
            };

            return NextResponse.json(result, { status: 200 });
        } else {
            const scorekeepers = await prisma.match_scores.findMany({
                select: { id: true, name: true },
            });

            return NextResponse.json(scorekeepers, { status: 200 });
        }
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, player_one_name, player_two_name, player_one_tag, player_two_tag, stage_first_to, bracket_stage } =
            body;

        const timestamp = new Date().toISOString();
        const id = generateHash(timestamp);

        const new_data = {
            id,
            name: name || null,
            player_one_name: player_one_name || 'player one',
            player_two_name: player_two_name || 'player two',
            player_one_tag: player_one_tag || '',
            player_two_tag: player_two_tag || '',
            player_one_score: 0, 
            player_two_score: 0,
            stage_first_to: stage_first_to || 3,
            bracket_stage: bracket_stage || 'Casuals',
        };
        const newScorekeeper = await prisma.match_scores.create({
            data: new_data,
        });

        return NextResponse.json(newScorekeeper, { status: 201 });
    } catch (error) {
        if (error instanceof Error){
            console.log("Error: ", error.stack)
        }
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, playersInfo, matchScore, stageFirstTo, bracketStage } = body.data;

        if (!id) {
            return NextResponse.json({ error: 'Scorekeeper ID is required' }, { status: 400 });
        }

        const updatedData = {
            name: name,
            player_one_name: playersInfo[0]?.playerName || '',
            player_one_tag: playersInfo[0]?.playerTag || '',
            player_two_name: playersInfo[1]?.playerName || '',
            player_two_tag: playersInfo[1]?.playerTag || '',
            player_one_score: matchScore[0] || 0,
            player_two_score: matchScore[1] || 0,
            stage_first_to: stageFirstTo || 3,
            bracket_stage: bracketStage || 'Casuals',
        };

        const updatedScorekeeper = await prisma.match_scores.update({
            where: { id },
            data: updatedData,
        });

        return NextResponse.json(updatedScorekeeper, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.stack);
        }
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
