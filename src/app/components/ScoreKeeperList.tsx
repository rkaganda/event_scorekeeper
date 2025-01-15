'use client';
import { useState } from "react";
import ScoreKeeper from "./ScoreKeeperView";
import CreateScoreKeeperDialog from "./dialogs/CreateScoreKeeperDialog";
import { createScoreKeeper } from "@/lib/client/scorekeeper";
import AddStartGGEventDialog from "./dialogs/AddStartGGEventDialog";

const ScoreKeeperList = () => {
    const [scoreKeepersIds, setScoreKeepersIds] = useState<string[]>([]);
    const [isScoreKeeperDialogOpen, setIsAddScoreKeeperDialogOpen] = useState<boolean>(false);
    const [isAddStartGGEventDialogOpen, setIsStartGGEventDialogOpen] = useState<boolean>(false);


    const addNewScoreKeeper = async (scoreKeeperName: string) => {
        setIsAddScoreKeeperDialogOpen(false);
        try {
            const { id } = await createScoreKeeper(scoreKeeperName);
            setScoreKeepersIds((prev) => [...prev, id]);
        } catch (error) {
            console.error('Error creating scorekeeper:', error);
        }
    };

    const addExistingScoreKeeper = async (scoreKeeperId: string) => {
        setIsAddScoreKeeperDialogOpen(false);
        try {
            setScoreKeepersIds((prev) => [...prev, scoreKeeperId]);
        } catch (error) {
            console.error('Error loading scorekeeper:', error);
        }
    };

    const removeScoreKeeper = (scoreKeeperId: string) => {
        setScoreKeepersIds((prev) => prev.filter((id) => id !== scoreKeeperId));
    };

    return (
        <div className="grid gap-1 sm:p-2 row-span-3 font-[family-name:var(--font-geist-sans)] max-w-4xl mx-auto">
            {scoreKeepersIds.map((id) => (
                <ScoreKeeper
                    key={id}
                    scoreKeeperId={id}
                    removeScoreKeeper={removeScoreKeeper}
                />
            ))}

<div className="flex flex-row justify-start items-center">
    <button
        className="flex items-center justify-center p-1 px-3 m-2 h-[80%] rounded-md transition-colors duration-200 bg-stone-900 text-stone-50 drop-shadow-xl hover:cursor-pointer hover:bg-stone-700 active:bg-stone-50 active:text-stone-900"
        onClick={() => setIsAddScoreKeeperDialogOpen(true)}
    >
        Add Score Keeper...
    </button>
    <button
        className="flex items-center justify-center p-1 px-3 m-2 h-[80%] rounded-md transition-colors duration-200 bg-stone-900 text-stone-50 drop-shadow-xl hover:cursor-pointer hover:bg-stone-700 active:bg-stone-50 active:text-stone-900"
        onClick={() => setIsStartGGEventDialogOpen(true)}
    >
        Add Start GG Event...
    </button>
</div>

            {isScoreKeeperDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-stone-600 p-4 rounded shadow-lg w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white"></h2>
                            <button
                                className="text-white text-lg font-bold hover:cursor-pointer"
                                onClick={() => setIsAddScoreKeeperDialogOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <CreateScoreKeeperDialog
                            createNewScoreKeeper={(name) => addNewScoreKeeper(name)}
                            addExistingScoreKeeper={(id) => addExistingScoreKeeper(id)}
                            existingScoreKeeperIds={scoreKeepersIds}
                        />
                    </div>
                </div>
            )}
            {isAddStartGGEventDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-stone-600 p-4 rounded shadow-lg w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white"></h2>
                            <button
                                className="text-white text-lg font-bold hover:cursor-pointer"
                                onClick={() => setIsStartGGEventDialogOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <AddStartGGEventDialog
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScoreKeeperList;
