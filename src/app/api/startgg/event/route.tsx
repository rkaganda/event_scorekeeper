import { NextResponse, NextRequest } from 'next/server';
import { populateEventWinLossSheet } from '@/lib/server/startgg';


export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventSlug } = body.data;

        if (!eventSlug) {
            return NextResponse.json({ error: 'eventSlug is required' }, { status: 400 });
        }

        const response_string = await populateEventWinLossSheet(eventSlug);
       
        return NextResponse.json( { status: 200, message: response_string });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.stack);
        }
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
