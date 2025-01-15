import { useState, useEffect } from "react";

type ScoreControlProps = {
  stageFirstTo: number;
  score: number;
  playerNumber: number;
  onScoreChange: (playerNumber: number, newScore: number) => void;
};

const ScoreControl = ({ stageFirstTo, score, playerNumber, onScoreChange }: ScoreControlProps) => {
  const [currentScore, setCurrentScore] = useState(score);

  useEffect(() => {
    setCurrentScore(score);
  }, [score]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= stageFirstTo) {
      setCurrentScore(value);
      onScoreChange(playerNumber, value);
    }
  };

  const toggleDot = (index: number) => {
    if (index + 1 === currentScore) {
      setCurrentScore(index);
      onScoreChange(playerNumber, index);
    } else {
      setCurrentScore(index + 1);
      onScoreChange(playerNumber, index + 1);
    }
  };

  return (
    <div className="relative z-0 flex items-center space-x-4">
      <div className="w-1/3">
        <input
          type="text"
          id={`player_${playerNumber}_score`}
          className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:text-white dark:border-gray-400 dark:focus:border-gray-100 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
          value={currentScore}
          onChange={handleInputChange}
        />
        <label
          htmlFor={`player_${playerNumber}_score`}
          className="absolute text-sm text-gray-400 dark:text-gray-300 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-gray-100 peer-focus:dark:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Player {playerNumber} Score
        </label>
      </div>
      <div className="flex flex-wrap space-x-2">
        {Array.from({ length: stageFirstTo }, (_, index) => (
          <button
            key={index}
            onClick={() => toggleDot(index)}
            className={`w-6 h-6 rounded-full border-2 ${
              index < currentScore
                ? "bg-gray-100 border-gray-100 dark:bg-white dark:border-white"
                : "bg-transparent border-gray-500 dark:border-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ScoreControl;
