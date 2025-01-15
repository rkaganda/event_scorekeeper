import { StartggGamerTag } from '../types';
import { apiRequest } from './api';


export const fetchGamerTags = (searchTerm: string): Promise<StartggGamerTag[]> => {
    const url = `/api/startgg/player?searchTerm=${searchTerm}`;

    return apiRequest(url, 'GET');
};


