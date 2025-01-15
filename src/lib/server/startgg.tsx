import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apiUrl = process.env.STARTGG_API_URL as string;
const startggKey = process.env.STARTGG_KEY as string;

interface EventSet {
    id: string;
    winnerId: number;
    slots: Slot[];
    tournament: {
        name: string;
    };
}

interface Slot {
    entrant: {
        id: number;
        name: string;
        participants: Participant[];
    };
    standing: {
        stats: {
            score: {
                value: number;
            };
        };
    };
}

interface Participant {
    id: number;
    gamerTag: string;
    user?: {
        id: number;
    };
}

export async function populateEventWinLossSheet(eventSlug: string): Promise<string> {
    const url = `${apiUrl}/gql/alpha`;
    const query = `
    query EventSets($eventSlug: String!, $pageNum: Int!, $perPage: Int!) {
      event(slug: $eventSlug) {
        tournament {
          name
        }
        sets(page: $pageNum, perPage: $perPage) {
          pageInfo {
            totalPages
            page
          }
          nodes {
            id
            winnerId
            slots(includeByes: false) {
              entrant {
                id
                name
                participants {
                  id
                  gamerTag
                  user {
                    id
                  }
                }
              }
              standing {
                stats {
                  score {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

    const perPage = 20;
    let pageNum = 1;
    let totalPages = 1;
    let totalSetsUpdated = 0;
    let totalPlayersUpdated = 0;

    do {
        const variables = {
            eventSlug,
            pageNum,
            perPage,
        };

        const body = { query, variables };

        let response: Response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${startggKey}`,
                },
                body: JSON.stringify(body),
            });

            if (response.status === 429) {
                console.warn("Rate limit exceeded. Retrying in 60 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 60000));
                continue;
            }
        } catch (error) {
            console.error("Fetch failed:", error);
            await new Promise((resolve) => setTimeout(resolve, 60000));
            continue;
        }

        const data = await response.json();

        if (!data.data || !data.data.event || !data.data.event.sets) {
            return `No sets data for event: ${eventSlug}`;
        }

        const sets: EventSet[] = data.data.event.sets.nodes;
        totalPages = data.data.event.sets.pageInfo.totalPages;
        pageNum++;

        for (const set of sets) {
            const winner = set.slots.find((slot) => slot.entrant.id === set.winnerId);
            const loser = set.slots.find((slot) => slot.entrant.id !== set.winnerId);

            if (!winner || !loser || !winner.entrant || !loser.entrant) {
                console.warn(`Skipping set ${set.id} due to missing entrant info.`);
                continue;
            }

            const winnerUserId = winner.entrant.participants[0]?.user?.id;
            const loserUserId = loser.entrant.participants[0]?.user?.id;

            if (!winnerUserId || !loserUserId) {
                console.warn(`Skipping set ${set.id} due to missing user info.`);
                continue;
            }

            await prisma.startgg_gamertags.upsert({
                where: {
                    gamertag_startgg_id: {
                        gamertag: winner.entrant.name,
                        startgg_id: winnerUserId,
                    },
                },
                update: {},
                create: {
                    gamertag: winner.entrant.name,
                    startgg_id: winnerUserId,
                },
            });

            await prisma.startgg_gamertags.upsert({
                where: {
                    gamertag_startgg_id: {
                        gamertag: loser.entrant.name,
                        startgg_id: loserUserId,
                    },
                },
                update: {},
                create: {
                    gamertag: loser.entrant.name,
                    startgg_id: loserUserId,
                },
            });

            totalSetsUpdated++;
            totalPlayersUpdated += 2; // Each set involves a winner and a loser.
        }
    } while (pageNum <= totalPages);

    return `${totalSetsUpdated} sets updated, ${totalPlayersUpdated} players updated`;
}
