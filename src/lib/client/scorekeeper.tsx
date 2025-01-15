import { ScoreKeeper, ScoreKeeperName } from '../types';
import { apiRequest } from './api';


export const fetchScoreKeeper = (id: string): Promise<ScoreKeeper> => {
    const url = `/api/scorekeeper?id=${id}`;

    return apiRequest(url, 'GET');
};


export const fetchScoreKeepers = (): Promise<ScoreKeeperName[]> => {
    const url = `/api/scorekeeper`;

    return apiRequest(url, 'GET');
};


export const createScoreKeeper = (name: string): Promise<{ id: string }> => {
    const url = `/api/scorekeeper`;
    return apiRequest(url, 'POST', { name });
};

export const updateScoreKeeper = (data: ScoreKeeper): Promise<ScoreKeeper> => {
    const url = `/api/scorekeeper`;
    return apiRequest(url, 'PUT', { data });
};
