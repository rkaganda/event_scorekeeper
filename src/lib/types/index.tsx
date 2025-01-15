export type MatchScore =  {
    [team: number]: number;
};

export type PlayerInfo = {
    playerName: string;
    playerTag?: string;
};

export type Team = {
    players: PlayerInfo[]
}

export type ScoreKeeper = {
    name: string,
    id: string,
    playersInfo: { 0: PlayerInfo, 1: PlayerInfo },
    matchScore: MatchScore,
    stageFirstTo: number,
    bracketStage: string
}

export type ScoreKeeperName = {
    id: string,
    name: string
}

export type StartggGamerTag = {
    gamertag: string,
    startgg_id: number
}