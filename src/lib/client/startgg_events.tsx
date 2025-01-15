import { NextResponse } from 'next/server';
import { apiRequest } from './api';

export const addStartGGEvent = async (startgg_event_url: string): Promise<NextResponse> => {
    const url = `/api/startgg/event`;

    try {
        const response = await apiRequest(url, 'PUT', { data: { eventSlug: startgg_event_url } });

        if (response?.status === 200) {
            return NextResponse.json({ message: response.message, data: response.data }, { status: 200 });
        }

        return NextResponse.json({ error: 'Failed to add event.' }, { status: response?.status || 400 });
    } catch (error) {
        console.error('Error in addStartGGEvent:', error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
};
