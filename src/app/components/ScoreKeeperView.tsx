import { useEffect, useState } from "react";
import BracketControl from "./BracketControl";
import ScoreControl from "./ScoreControl";
import PlayerControl from "./PlayerControl";
import { ScoreKeeper, PlayerInfo } from "@/lib/types";
import { fetchScoreKeeper, updateScoreKeeper } from "@/lib/client/scorekeeper";

type ScoreKeeperViewProps = {
    scoreKeeperId: string;
    removeScoreKeeper: (id: string) => void;
};

const ScoreKeeperView = ({ scoreKeeperId, removeScoreKeeper }: ScoreKeeperViewProps) => {
    const [scoreKeeper, setScoreKeeper] = useState<ScoreKeeper>({
        name: "",
        id: scoreKeeperId,
        playersInfo: {
            0: { playerName: "player_one", playerTag: "" },
            1: { playerName: "player_two", playerTag: "" },
        },
        matchScore: { 0: 0, 1: 0 },
        stageFirstTo: 2,
        bracketStage: "Casuals",
    });
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: ScoreKeeper = await fetchScoreKeeper(scoreKeeperId);
                setScoreKeeper(data);
            } catch (error) {
                console.error("Error fetching ScoreKeeper data:", error);
            } finally {
                setIsFetched(true);
            }
        };

        fetchData();
    }, [scoreKeeperId]);

    useEffect(() => {
        if (!isFetched) return;

        const updateData = async () => {
            try {
                await updateScoreKeeper(scoreKeeper);
            } catch (error) {
                console.error("Error updating ScoreKeeper data:", error);
            }
        };

        updateData();
    }, [scoreKeeper, isFetched]);

    const handleNameChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
    ) => {
        if ("type" in e && e.type === "blur") {
            const value = (e.target as HTMLInputElement).value;
            setScoreKeeper((prev) => ({ ...prev, name: value }));
        } else if ("key" in e && e.key === "Enter") {
            const target = e.target as HTMLInputElement;
            setScoreKeeper((prev) => ({ ...prev, name: target.value }));
        }
    };

    const handleBracketChange = (newBracketString: string) => {
        setScoreKeeper((prev) => ({ ...prev, bracketStage: newBracketString }));
    };

    const handleStageFirstToChange = (newStageFirstTo: number) => {
        setScoreKeeper((prev) => ({ ...prev, stageFirstTo: newStageFirstTo }));
    };

    const handlePlayerInfoChange = (playerNumber: number, newPlayerInfo: PlayerInfo) => {
        setScoreKeeper((prev) => ({
            ...prev,
            playersInfo: {
                ...prev.playersInfo,
                [playerNumber]: newPlayerInfo,
            },
        }));
    };

    const handleScoreChange = (playerNumber: number, newScore: number) => {
        setScoreKeeper((prev) => ({
            ...prev,
            matchScore: {
                ...prev.matchScore,
                [playerNumber]: newScore,
            },
        }));
    };

    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
            alert('Link copied to clipboard!');
        } catch (err) {
            alert('Failed to copy the link.');
        }
        document.body.removeChild(textArea);
    };
    
    const getScoreKeeperDataLink = () => {
        const currentUrl = window.location.href.split('?')[0];
        const shareUrl = `${currentUrl}api/scorekeeper?id=${scoreKeeperId}`;
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    alert('Link copied to clipboard!');
                })
                .catch(() => {
                    alert('Failed to copy the link.');
                });
        } else {
            fallbackCopyTextToClipboard(shareUrl);
        }
    };
    
    return (
        <div className="flex flex-col items-center p-4 m-2 rounded-md duration-200 bg-stone-600">
            <div className="grid grid-cols-3 items-center mb-4 w-full">
                <div className="col-span-2 z-0 flex items-center gap-2">
                    <input
                        type="text"
                        className="text-xl py-2.5 px-0 w-50 text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200"
                        defaultValue={scoreKeeper.name}
                        onBlur={(e) => handleNameChange(e)}
                        onKeyDown={(e) => handleNameChange(e)}
                    />
                    <button
                        className="text-white text-lg font-bold hover:cursor-pointer ml-1"
                        onClick={() => getScoreKeeperDataLink()}
                    >
                        🔗
                    </button>
                </div>
                <button
                    className="text-white col-start-3 justify-self-end text-lg font-bold hover:cursor-pointer"
                    onClick={() => removeScoreKeeper(scoreKeeperId)}
                >
                    ×
                </button>
            </div>

            <div className="w-full flex justify-center mb-4">
                <BracketControl
                    bracketStage={scoreKeeper.bracketStage}
                    stageFirstTo={scoreKeeper.stageFirstTo}
                    onBracketStageChange={handleBracketChange}
                    onStageFirstToChange={handleStageFirstToChange}
                />
            </div>
            <div className="w-full flex justify-around mb-4">
                <PlayerControl
                    playerInfo={scoreKeeper.playersInfo[0]}
                    playerNumber={0}
                    onPlayerInfoChange={handlePlayerInfoChange}
                />
                <PlayerControl
                    playerInfo={scoreKeeper.playersInfo[1]}
                    playerNumber={1}
                    onPlayerInfoChange={handlePlayerInfoChange}
                />
            </div>
            <div className="w-full flex justify-center">
                <ScoreControl
                    stageFirstTo={scoreKeeper.stageFirstTo}
                    score={scoreKeeper.matchScore[0]}
                    playerNumber={0}
                    onScoreChange={handleScoreChange}
                />
                <ScoreControl
                    stageFirstTo={scoreKeeper.stageFirstTo}
                    score={scoreKeeper.matchScore[1]}
                    playerNumber={1}
                    onScoreChange={handleScoreChange}
                />
            </div>
        </div>
    );
};

export default ScoreKeeperView;
