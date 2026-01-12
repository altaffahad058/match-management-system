"use client";

import { useState } from "react";

interface Ball {
  id?: number;
  ball_number: number;
  batsman_id: number;
  bowler_id: number;
  runs_off_bat: number;
  extra_type: string | null;
  extra_runs: number | null;
  is_legal_delivery: boolean;
  wicket_type: string | null;
  out_player_id: number | null;
}

interface Over {
  over_number: number;
  bowler_id: number;
  balls: Ball[];
}

interface MatchScorecardProps {
  battingTeamId: number;
  bowlingTeamId: number;
  battingPlayers: Array<{ id: number; name: string }>;
  bowlingPlayers: Array<{ id: number; name: string }>;
  currentOver: number;
  totalOvers: number;
  lastBowlerId?: number | null;
  strikerId: number | null;
  nonStrikerId: number | null;
  onStrikerChange: (id: number) => void;
  onNonStrikerChange: (id: number) => void;
  isOverInProgress: boolean;
  onBallSubmit: (ball: Ball) => void;
}

export default function MatchScorecard({
  battingTeamId,
  bowlingTeamId,
  battingPlayers,
  bowlingPlayers,
  currentOver,
  totalOvers,
  lastBowlerId,
  strikerId,
  nonStrikerId,
  onStrikerChange,
  onNonStrikerChange,
  isOverInProgress,
  onBallSubmit,
}: MatchScorecardProps) {
  const [selectedBowler, setSelectedBowler] = useState<number | null>(null);
  const [runs, setRuns] = useState<number>(0);
  const [extraType, setExtraType] = useState<string>("");
  const [extraRuns, setExtraRuns] = useState<number>(0);
  const [wicketType, setWicketType] = useState<string>("");
  const [outPlayerId, setOutPlayerId] = useState<number | null>(null);
  const [isLegalDelivery, setIsLegalDelivery] = useState<boolean>(true);
  const [currentBall, setCurrentBall] = useState<number>(1);

  const handleSubmit = () => {
    if (!strikerId || !nonStrikerId || !selectedBowler) {
      alert("Please select striker, non-striker, and bowler");
      return;
    }

    if (strikerId === nonStrikerId) {
      alert("Striker and Non-Striker must be different players");
      return;
    }

    if (wicketType && !outPlayerId) {
      alert("Please select the out player");
      return;
    }

    const ball: Ball = {
      ball_number: currentBall,
      batsman_id: strikerId,
      bowler_id: selectedBowler,
      runs_off_bat: runs,
      extra_type: extraType || null,
      extra_runs: extraRuns > 0 ? extraRuns : null,
      is_legal_delivery: isLegalDelivery,
      wicket_type: wicketType || null,
      out_player_id: outPlayerId,
    };

    onBallSubmit(ball);

    // Reset form
    setRuns(0);
    setExtraType("");
    setExtraRuns(0);
    setWicketType("");
    setOutPlayerId(null);
    setIsLegalDelivery(true);

    // Move to next ball
    if (currentBall < 6) {
      setCurrentBall(currentBall + 1);
    } else {
      setCurrentBall(1);
      // Reset selected bowler for new over
      setSelectedBowler(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Over {currentOver} of {totalOvers} - Ball {currentBall}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Striker *
          </label>
          <select
            value={strikerId || ""}
            onChange={(e) => onStrikerChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
            disabled={isOverInProgress && !!strikerId}
          >
            <option value="">Select Striker</option>
            {battingPlayers.map((player) => (
              <option
                key={player.id}
                value={player.id}
                disabled={player.id === nonStrikerId}
              >
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Non-Striker *
          </label>
          <select
            value={nonStrikerId || ""}
            onChange={(e) => onNonStrikerChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
            disabled={isOverInProgress && !!nonStrikerId}
          >
            <option value="">Select Non-Striker</option>
            {battingPlayers.map((player) => (
              <option
                key={player.id}
                value={player.id}
                disabled={player.id === strikerId}
              >
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bowler *
          </label>
          <select
            value={selectedBowler || ""}
            onChange={(e) => setSelectedBowler(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
            disabled={isOverInProgress}
          >
            <option value="">Select Bowler</option>
            {bowlingPlayers.map((player) => (
              <option
                key={player.id}
                value={player.id}
                disabled={player.id === lastBowlerId}
              >
                {player.name}{" "}
                {player.id === lastBowlerId ? "(Bowled Last Over)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Runs off Bat
          </label>
          <input
            type="number"
            min="0"
            max="6"
            value={runs}
            onChange={(e) => setRuns(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Extra Type
          </label>
          <select
            value={extraType}
            onChange={(e) => setExtraType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">None</option>
            <option value="no_ball">No Ball</option>
            <option value="wide">Wide</option>
            <option value="bye">Bye</option>
            <option value="leg_bye">Leg Bye</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Extra Runs
          </label>
          <input
            type="number"
            min="0"
            value={extraRuns}
            onChange={(e) => setExtraRuns(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={!extraType}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Legal Delivery
          </label>
          <input
            type="checkbox"
            checked={isLegalDelivery}
            onChange={(e) => setIsLegalDelivery(e.target.checked)}
            className="w-5 h-5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Wicket Type
          </label>
          <select
            value={wicketType}
            onChange={(e) => setWicketType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">No Wicket</option>
            <option value="caught">Caught</option>
            <option value="run_out">Run Out</option>
            <option value="bowled">Bowled</option>
            <option value="lbw">LBW</option>
          </select>
        </div>

        {wicketType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Out Player
            </label>
            <select
              value={outPlayerId || ""}
              onChange={(e) =>
                setOutPlayerId(e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select Player</option>
              {battingPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          Record Ball
        </button>
        <button
          onClick={() => {
            setCurrentBall(1);
            setRuns(0);
            setExtraType("");
            setExtraRuns(0);
            setWicketType("");
            setOutPlayerId(null);
            setIsLegalDelivery(true);
          }}
          className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700"
        >
          Reset Over
        </button>
      </div>
    </div>
  );
}
