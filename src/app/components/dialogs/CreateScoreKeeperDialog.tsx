import { fetchScoreKeepers } from "@/lib/client/scorekeeper";
import { ScoreKeeperName } from "@/lib/types";
import { useEffect, useState } from "react";

type CreateScoreKeeperDialogProps = {
    createNewScoreKeeper: (newName: string) => (void);
    addExistingScoreKeeper: (id: string) => (void);
    existingScoreKeeperIds: string[];
}

const CreateScoreKeeperDialog = ({ createNewScoreKeeper, addExistingScoreKeeper, existingScoreKeeperIds }: CreateScoreKeeperDialogProps) => {
    const [scoreKeepers, setScoreKeepers] = useState<ScoreKeeperName[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newScoreKeeperName, setNewScoreKeeperName] = useState<string>('New Scorekeeper');

    const handeNewScoreKeeperNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewScoreKeeperName(event.target.value);
    };

    const handleCreateNewScoreKeeper = () => {
        createNewScoreKeeper(newScoreKeeperName);
    };

    const handleAddExistingScorekeeper = (id: string) => {
        addExistingScoreKeeper(id);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchScoreKeepers();
                setScoreKeepers(data);
            } catch (err) {
                console.error("Error fetching replay data:", err);
                setError("Error loading replay data. Please try again later.");
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div className="grid gap-1 sm:p-2 row-span-3 font-[family-name:var(--font-geist-sans)] max-w-4xl mx-auto">
            <div >
                {scoreKeepers
                    .filter((scorekeeper) => !existingScoreKeeperIds.includes(scorekeeper.id))
                    .map((scorekeeper) => (
                        <div
                            key={scorekeeper.id}
                            className="flex flex-row p-4 m-2 rounded-md transition-colors duration-200 bg-stone-900 hover:cursor-pointer hover:bg-stone-700 drop-shadow-xl"
                            onClick={() => handleAddExistingScorekeeper(scorekeeper.id)}
                        >
                            {scorekeeper.name}
                        </div>
                    ))}
            </div>
            <div>
                <div className="relative z-0 flex items-center space-x-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            id="floating_standard"
                            className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            value={newScoreKeeperName}
                            onChange={handeNewScoreKeeperNameChange}
                        />
                        <label
                            htmlFor="floating_standard"
                            className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        >
                            name
                        </label>
                    </div>
                    <button
                        className="flex flex-row items-center justify-around h-[80%] p-4 m-2 rounded-md transition-colors duration-200 bg-stone-900 text-stone-50 drop-shadow-xl hover:cursor-pointer hover:bg-stone-700 active:bg-stone-50 active:text-stone-900"
                        onClick={() => handleCreateNewScoreKeeper()}
                    >
                        Create New.
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateScoreKeeperDialog;
