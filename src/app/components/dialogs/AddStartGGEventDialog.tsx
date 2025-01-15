import { useState } from "react";
import { addStartGGEvent as addStartGGEventAPI } from "@/lib/client/startgg_events";

const AddStartGGEventDialog = () => {
    const [newStartEventUrl, setStartEventUrl] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const handleStartEventUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartEventUrl(event.target.value);
    };

    const addStartGGEvent = async () => {
        if (!newStartEventUrl.trim()) {
            setStatus("Error: URL cannot be empty");
            return;
        }
    
        setIsAdding(true);
        setStatus("Adding...");
    
        try {
            const response = await addStartGGEventAPI(newStartEventUrl);
    
            if (response?.ok) {
                const responseData = await response.json();
                setStatus(`${responseData?.message || "OK."}`);
            } else {
                const errorData = await response.json();
                setStatus(`Error: ${errorData?.error || "Failed to add the Start.gg event."}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
            setStatus(`Error: ${errorMessage}`);
        } finally {
            setIsAdding(false);
        }
    };
    

    return (
        <div className="grid gap-1 sm:p-2 row-span-3 font-[family-name:var(--font-geist-sans)] max-w-4xl mx-auto">
            <div>
                <div className="relative z-0 flex items-center space-x-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            id="floating_standard"
                            className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            value={newStartEventUrl}
                            onChange={handleStartEventUrlChange}
                            disabled={isAdding}
                        />
                        <label
                            htmlFor="floating_standard"
                            className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        >
                            Start.gg Event URL
                        </label>
                    </div>
                    <button
                        className={`flex flex-row items-center justify-around p-4 m-2 h-[80%] rounded-md transition-colors duration-200 ${
                            isAdding
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-stone-900 text-stone-50 hover:cursor-pointer hover:bg-stone-700 active:bg-stone-50 active:text-stone-900"
                        } drop-shadow-xl`}
                        onClick={addStartGGEvent}
                        disabled={isAdding}
                    >
                        {isAdding ? "Adding..." : "Add Event"}
                    </button>
                </div>
                <div className="mt-2 text-sm text-gray-300 dark:text-gray-400">{status}</div>
            </div>
        </div>
    );
};

export default AddStartGGEventDialog;
