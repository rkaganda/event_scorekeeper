import { useEffect, useState } from "react";
import { PlayerInfo } from "@/lib/types";
import { fetchGamerTags } from "@/lib/client/startgg_player";
import { StartggGamerTag } from "@/lib/types";

type PlayerControlProps = {
    playerInfo: PlayerInfo;
    playerNumber: number;
    onPlayerInfoChange: (playerNumber: number, updatedPlayerInfo: PlayerInfo) => void;
};

const PlayerControl = ({ playerInfo, playerNumber, onPlayerInfoChange }: PlayerControlProps) => {
    const [localPlayerInfo, setLocalPlayerInfo] = useState<PlayerInfo>(playerInfo);
    const [autocompleteResults, setAutocompleteResults] = useState<StartggGamerTag[]>([]);
    const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);

    useEffect(() => {
        setLocalPlayerInfo(playerInfo);
    }, [playerInfo]);

    const handlePlayerNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const updatedInfo = { ...localPlayerInfo, playerName: value };
        setLocalPlayerInfo(updatedInfo);
        onPlayerInfoChange(playerNumber, updatedInfo);

        if (value.length > 1) {
            try {
                const results = await fetchGamerTags(value);
                setAutocompleteResults(results);
                setIsAutocompleteVisible(true);
            } catch (error) {
                console.error("Error fetching gamer tags:", error);
            }
        } else {
            setAutocompleteResults([]);
            setIsAutocompleteVisible(false);
        }
    };

    const handleAutocompleteSelect = (gamertag: string) => {
        const updatedInfo = { ...localPlayerInfo };
    
        if (gamertag.includes('|')) {
            const [tag, name] = gamertag.split('|').map((part) => part.trim());
            updatedInfo.playerTag = tag;
            updatedInfo.playerName = name;
        } else {
            updatedInfo.playerName = gamertag;
        }
    
        setLocalPlayerInfo(updatedInfo);
        onPlayerInfoChange(playerNumber, updatedInfo);
    
        setIsAutocompleteVisible(false);
    };

    const handlePlayerTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedInfo = { ...localPlayerInfo, playerTag: e.target.value };
        setLocalPlayerInfo(updatedInfo);
        onPlayerInfoChange(playerNumber, updatedInfo);
    };

    return (
        <div className="flex flex-row items-center justify-around p-4 m-2 rounded-md transition-colors duration-200 bg-stone-800">
            <div className="relative z-10">
                <input
                    type="text"
                    id="player_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={localPlayerInfo.playerName}
                    onChange={handlePlayerNameChange}
                    onFocus={() => setIsAutocompleteVisible(true)}
                    onBlur={() => setTimeout(() => setIsAutocompleteVisible(false), 150)}
                />
                <label
                    htmlFor="player_name"
                    className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Player Name
                </label>
                <div className="relative">
                {isAutocompleteVisible && autocompleteResults.length > 0 && (
                    <ul className="absolute bg-stone-500/100 border border-stone-600/100 rounded-md shadow-md mt-1 w-full max-h-40 overflow-y-auto">
                        {autocompleteResults.map((result) => (
                            <li
                                key={result.startgg_id}
                                className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 cursor-pointer"
                                onClick={() => handleAutocompleteSelect(result.gamertag)}
                            >
                                {result.gamertag}
                            </li>
                        ))}
                    </ul>
                )}
                </div>
            </div>

            <div className="relative z-0">
                <input
                    type="text"
                    id="player_tag"
                    className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={localPlayerInfo.playerTag || ""}
                    onChange={handlePlayerTagChange}
                />
                <label
                    htmlFor="player_tag"
                    className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:start-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Player Tag
                </label>
            </div>
        </div>
    );
};

export default PlayerControl;
