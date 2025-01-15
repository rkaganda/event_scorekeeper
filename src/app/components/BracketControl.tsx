type BracketControlProps = {
    bracketStage: string,
    stageFirstTo: number,
    onBracketStageChange: (value: string) => void;
    onStageFirstToChange: (value: number) => void;
}

const BracketControl = ({ bracketStage, stageFirstTo, onBracketStageChange, onStageFirstToChange  }: BracketControlProps) => {
    const handleBracketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newBracketString = event.target.value;
        onBracketStageChange(newBracketString); 
    };

    const handleStageFirstToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFirstToValue = Number(event.target.value);
        onStageFirstToChange(newFirstToValue); 
    };

    return (
        <div
            className="flex flex-row items-center justify-around p-4 m-2 rounded-md transition-colors duration-200 bg-stone-800"
        >
            <div className="relative z-0">
                <input
                    type="text"
                    id="floating_standard"
                    className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={bracketStage}
                    onChange={handleBracketChange}
                />
                <label
                    htmlFor="floating_standard"
                    className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                    Bracket Stage
                </label>
            </div>
            <>
                <div className="relative z-0">
                    <input
                        type="number"
                        id="floating_standard_2"
                        className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                        value={stageFirstTo}
                        onChange={handleStageFirstToChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                    <label
                        htmlFor="floating_standard_2"
                        className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                    >
                        First to:
                    </label>
                </div>
            </>
        </div>
    );

};

export default BracketControl;