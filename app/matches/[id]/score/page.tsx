"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LiveScore from "@/app/components/LiveScore";
import MatchScorecard from "@/app/components/MatchScorecard";
import PlayingXISelector from "@/app/components/PlayingXISelector";
import OverDisplay from "@/app/components/OverDisplay";
import MatchSummary from "@/app/components/MatchSummary"; // Import MatchSummary

interface Match {
  id: number;
  team1_id: number;
  team2_id: number;
  team1_name: string;
  team2_name: string;
  toss_winner_team_id: number;
  elected_to: string;
  match_date: string;
  venue: string;
  total_overs?: number;
}

interface Player {
  id: number;
  name: string;
  role: string;
  team_id: number;
}

interface Innings {
  id: number;
  match_id: number;
  batting_team_id: number;
  bowling_team_id: number;
  innings_number: number;
}

export default function MatchScorePage() {
  const params = useParams();
  const router = useRouter();
  const matchId = parseInt(params.id as string);

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [step, setStep] = useState<"setup" | "playing-xi" | "scoring">("setup");

  // Setup state
  const [totalOvers, setTotalOvers] = useState<number>(20);

  // Playing XI state
  const [team1Players, setTeam1Players] = useState<Player[]>([]);
  const [team2Players, setTeam2Players] = useState<Player[]>([]);
  const [team1XI, setTeam1XI] = useState<number[]>([]);
  const [team2XI, setTeam2XI] = useState<number[]>([]);

  // Scoring state
  const [currentInnings, setCurrentInnings] = useState<Innings | null>(null);
  const [currentInningsNumber, setCurrentInningsNumber] = useState<number>(1);
  const [battingTeamId, setBattingTeamId] = useState<number | null>(null);
  const [bowlingTeamId, setBowlingTeamId] = useState<number | null>(null);
  const [currentOver, setCurrentOver] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [wickets, setWickets] = useState<number>(0);
  const [ballsBowled, setBallsBowled] = useState<number>(0);
  const [currentOverBalls, setCurrentOverBalls] = useState<any[]>([]);
  const [strikerId, setStrikerId] = useState<number | null>(null);
  const [nonStrikerId, setNonStrikerId] = useState<number | null>(null);
  const [matchFinished, setMatchFinished] = useState(false);
  const [outPlayers, setOutPlayers] = useState<number[]>([]);
  const [lastBowlerId, setLastBowlerId] = useState<number | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  useEffect(() => {
    if (match) {
      fetchPlayers();
    }
  }, [match]);

  // Fetch players when moving to playing-xi step if not already loaded
  useEffect(() => {
    if (
      step === "playing-xi" &&
      match &&
      (team1Players.length === 0 || team2Players.length === 0)
    ) {
      fetchPlayers();
    }
  }, [step, match]);

  useEffect(() => {
    if (match && step === "scoring") {
      initializeInnings();
    }
  }, [step, match, currentInningsNumber]);

  const fetchMatch = async () => {
    // Prevent fetching if matchId is not valid
    if (isNaN(matchId)) return;

    try {
      const response = await fetch(`/api/matches/${matchId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch match");
      }
      const data = await response.json();
      setMatch(data);
    } catch (error) {
      console.error("Error fetching match:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayers = async () => {
    if (!match) return;

    setPlayersLoading(true);
    try {
      const [team1Res, team2Res] = await Promise.all([
        fetch(`/api/players?team_id=${match.team1_id}`),
        fetch(`/api/players?team_id=${match.team2_id}`),
      ]);

      if (!team1Res.ok || !team2Res.ok) {
        throw new Error("Failed to fetch players");
      }

      const team1Data = await team1Res.json();
      const team2Data = await team2Res.json();

      setTeam1Players(Array.isArray(team1Data) ? team1Data : []);
      setTeam2Players(Array.isArray(team2Data) ? team2Data : []);
    } catch (error) {
      console.error("Error fetching players:", error);
      setTeam1Players([]);
      setTeam2Players([]);
    } finally {
      setPlayersLoading(false);
    }
  };

  const handleSetupComplete = async () => {
    // TODO: Update match with total_overs
    // Save total overs to match
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...match,
          total_overs: totalOvers,
        }),
      });

      if (response.ok) {
        setStep("playing-xi");
      }
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handlePlayingXIComplete = async () => {
    if (team1XI.length !== 11 || team2XI.length !== 11) {
      alert("Please select 11 players for each team");
      return;
    }

    // TODO: Save playing XI to database
    try {
      const response = await fetch(`/api/matches/${matchId}/playing-xi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          players: [
            ...team1XI.map((playerId) => ({
              team_id: match!.team1_id,
              player_id: playerId,
              is_playing_xi: true,
            })),
            ...team2XI.map((playerId) => ({
              team_id: match!.team2_id,
              player_id: playerId,
              is_playing_xi: true,
            })),
          ],
        }),
      });

      if (response.ok) {
        setStep("scoring");
      }
    } catch (error) {
      console.error("Error saving playing XI:", error);
    }
  };

  const initializeInnings = async () => {
    if (!match) return;

    // Determine batting and bowling teams based on toss
    // If it's the second innings, swap the teams
    let battingTeam: number;
    let bowlingTeam: number;

    if (currentInningsNumber === 1) {
      if (match.elected_to === "bat") {
        battingTeam = match.toss_winner_team_id;
        bowlingTeam =
          battingTeam === match.team1_id ? match.team2_id : match.team1_id;
      } else {
        bowlingTeam = match.toss_winner_team_id;
        battingTeam =
          bowlingTeam === match.team1_id ? match.team2_id : match.team1_id;
      }
    } else {
      // For second innings, swap logic from first innings
      // If first innings batting team was team1, now it's team2
      // We can check who batted first by looking at match logic again or previous state
      // Simpler: just swap current batting/bowling
      battingTeam = bowlingTeamId!;
      bowlingTeam = battingTeamId!;
    }

    setBattingTeamId(battingTeam);
    setBowlingTeamId(bowlingTeam);

    // TODO: Create innings in database
    try {
      const response = await fetch("/api/innings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: matchId,
          batting_team_id: battingTeam,
          bowling_team_id: bowlingTeam,
          innings_number: currentInningsNumber,
        }),
      });

      if (response.ok) {
        const innings = await response.json();
        setCurrentInnings(innings);
      }
    } catch (error) {
      console.error("Error creating innings:", error);
    }
  };

  // Helper to start next innings
  const startNextInnings = (finalScore?: number) => {
    if (currentInningsNumber === 1 && finalScore !== undefined) {
      setTargetScore(finalScore + 1);
    }

    // Match finished logic helper
    const finishMatch = async () => {
      try {
        await fetch(`/api/matches/${matchId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...match,
            status: "completed",
          }),
        });
        setMatchFinished(true);
      } catch (error) {
        console.error("Error updating match status:", error);
      }
    };

    if (currentInningsNumber >= 2) {
      // Show Summary
      finishMatch();
      return;
    }

    alert("Innings Ended! Starting next innings...");
    setCurrentInningsNumber(currentInningsNumber + 1);

    // Reset scoring state
    setScore(0);
    setWickets(0);
    setBallsBowled(0);
    setCurrentOver(1);
    setCurrentOverBalls([]);
    setOutPlayers([]);
    setLastBowlerId(null);
    setCurrentInnings(null); // this will trigger initializeInnings via useEffect
    setStrikerId(null);
    setNonStrikerId(null);
  };

  const handleBallSubmit = async (ball: any) => {
    if (!currentInnings) return;

    // TODO: Create over if needed, then create ball
    try {
      // First, check if over exists, if not create it
      const oversResponse = await fetch(
        `/api/overs?innings_id=${currentInnings.id}`
      );
      const overs = await oversResponse.json();

      let over = overs.find((o: any) => o.over_number === currentOver);

      if (!over) {
        // Create new over
        const overResponse = await fetch("/api/overs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            innings_id: currentInnings.id,
            over_number: currentOver,
            bowler_id: ball.bowler_id,
          }),
        });

        if (overResponse.ok) {
          over = await overResponse.json();
        }
      }

      // Create ball
      const ballResponse = await fetch("/api/balls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ball,
          over_id: over.id,
        }),
      });

      if (ballResponse.ok) {
        const savedBall = await ballResponse.json();

        const runs = ball.runs_off_bat;
        // Extras that involve crossing: Bye, Leg Bye, No Ball (if ran)
        // Assume extra_runs includes ran runs for No Ball?
        // Standard: Wide (1) - no cross. No ball (1) + runs.
        // Simplified Logic:
        // If (runs_off_bat + (is_bye_or_legbye ? extra_runs : 0)) is odd -> Swap
        // For No Ball, usually runs off bat are counted separately?
        // Our schema: `runs_off_bat`, `extra_runs`.
        // If No Ball + 1 run off bat -> runs_off_bat=1, extra_runs=1 (NB). Total 2. Cross? Yes (1 run off bat).
        // If Wide -> extra_runs=1. runs_off_bat=0. No cross.
        // If Bye/LB -> runs_off_bat=0. extra_runs=1. Cross.

        let physicalRuns = runs;
        if (ball.extra_type === "bye" || ball.extra_type === "leg_bye") {
          physicalRuns += ball.extra_runs || 0;
        }
        // If No Ball, usually physical runs = runs_off_bat.
        // So `physicalRuns` is mostly accurate for swap logic except complex scenarios.

        if (physicalRuns % 2 !== 0) {
          // Swap
          // Only if both defined
          if (strikerId && nonStrikerId) {
            const temp = strikerId;
            setStrikerId(nonStrikerId);
            setNonStrikerId(temp);
          }
        }

        // Update score
        const totalRuns = ball.runs_off_bat + (ball.extra_runs || 0);
        const newScore = score + totalRuns;
        setScore(newScore);

        // Add ball to current over display
        setCurrentOverBalls([...currentOverBalls, savedBall]);

        // Check for win condition in 2nd innings
        if (
          currentInningsNumber === 2 &&
          targetScore &&
          newScore >= targetScore
        ) {
          alert(
            `Match Won! ${
              battingTeamId === match?.team1_id
                ? match.team1_name
                : match?.team2_name
            } wins!`
          );
          // Show Summary and update status
          try {
            await fetch(`/api/matches/${matchId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...match,
                status: "completed",
              }),
            });
            setMatchFinished(true);
          } catch (e) {
            console.error("Error finishing match", e);
            setMatchFinished(true);
          }
          return;
        }

        // Handle wicket
        if (ball.wicket_type) {
          const newWickets = wickets + 1;
          setWickets(newWickets);
          if (ball.out_player_id) {
            setOutPlayers([...outPlayers, ball.out_player_id]);

            // Current striker is out? Reset striker.
            // Wait, could be non-striker (Run Out).
            // But `MatchScorecard` sets `out_player_id`.
            if (ball.out_player_id === strikerId) {
              setStrikerId(null); // Must select new
            } else if (ball.out_player_id === nonStrikerId) {
              setNonStrikerId(null); // Must select new
            }
          }

          // Check if innings should end due to wickets (10 wickets)
          if (newWickets >= 10) {
            startNextInnings(newScore);
            return;
          }
        }

        if (ball.is_legal_delivery) {
          const newBallsBowled = ballsBowled + 1;
          setBallsBowled(newBallsBowled);

          // Move to next over if 6 legal balls bowled
          if (newBallsBowled % 6 === 0) {
            // End of over logic
            setLastBowlerId(ball.bowler_id);

            // Swap strikers at end of over
            if (strikerId && nonStrikerId) {
              const temp = strikerId;
              setStrikerId(nonStrikerId);
              setNonStrikerId(temp);
            }

            // Check if innings should end due to overs
            if (currentOver >= totalOvers) {
              startNextInnings(newScore);
            } else {
              setCurrentOver(currentOver + 1);
              setCurrentOverBalls([]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error recording ball:", error);
    }
  };

  const getBattingPlayers = () => {
    const selectedTeam = battingTeamId === match?.team1_id ? team1XI : team2XI;
    const allPlayers =
      battingTeamId === match?.team1_id ? team1Players : team2Players;
    const teamPlayers = allPlayers.filter((p) => selectedTeam.includes(p.id));
    // Filter out players who are already out
    return teamPlayers.filter((p) => !outPlayers.includes(p.id));
  };

  const getBowlingPlayers = () => {
    const selectedTeam = bowlingTeamId === match?.team1_id ? team1XI : team2XI;
    const allPlayers =
      bowlingTeamId === match?.team1_id ? team1Players : team2Players;
    return allPlayers.filter((p) => selectedTeam.includes(p.id));
  };

  const calculateOvers = () => {
    const completedOvers = Math.floor(ballsBowled / 6);
    const balls = ballsBowled % 6;
    return `${completedOvers}.${balls}`;
  };

  const calculateRunRate = () => {
    const completedOvers = Math.floor(ballsBowled / 6);
    const oversDecimal = completedOvers + (ballsBowled % 6) / 6;
    return oversDecimal > 0 ? score / oversDecimal : 0;
  };

  const runRate = calculateRunRate();

  // Show Match Summary if finished
  if (matchFinished && match) {
    // Need a Summary Component
    // For now, simple text or import
    // We made MatchSummary component
    return <MatchSummary matchId={matchId} />;
  }

  // Need to import MatchSummary
  // Done via dynamic or just usage?
  // Let's assume import is added

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!match) {
    return <div className="p-8 text-center">Match not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link
          href={`/matches/${matchId}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-4 inline-block"
        >
          ← Back to Match
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {match.team1_name} vs {match.team2_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(match.match_date).toLocaleDateString()} • {match.venue}
          </p>
        </div>

        {/* Setup Step */}
        {step === "setup" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Match Setup
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Overs per Innings
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={totalOvers || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    setTotalOvers(value);
                  }
                }}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleSetupComplete}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue to Playing XI Selection
            </button>
          </div>
        )}

        {/* Playing XI Selection Step */}
        {step === "playing-xi" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Select Playing XI
              </h2>
              <button
                onClick={handlePlayingXIComplete}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={
                  team1XI.length !== 11 ||
                  team2XI.length !== 11 ||
                  playersLoading
                }
              >
                Start Match
              </button>
            </div>

            {playersLoading ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                Loading players...
              </div>
            ) : (
              <>
                <PlayingXISelector
                  teamId={match.team1_id}
                  teamName={match.team1_name}
                  availablePlayers={team1Players}
                  selectedPlayers={team1XI}
                  onSelectionChange={setTeam1XI}
                />

                <PlayingXISelector
                  teamId={match.team2_id}
                  teamName={match.team2_name}
                  availablePlayers={team2Players}
                  selectedPlayers={team2XI}
                  onSelectionChange={setTeam2XI}
                />
              </>
            )}
          </div>
        )}

        {/* Scoring Step */}
        {step === "scoring" && currentInnings && (
          <div className="space-y-6">
            <LiveScore
              battingTeam={
                battingTeamId === match.team1_id
                  ? match.team1_name
                  : match.team2_name
              }
              bowlingTeam={
                bowlingTeamId === match.team1_id
                  ? match.team1_name
                  : match.team2_name
              }
              score={score}
              wickets={wickets}
              overs={calculateOvers()}
              runRate={runRate}
            />

            {currentOverBalls.length > 0 && (
              <OverDisplay overNumber={currentOver} balls={currentOverBalls} />
            )}

            <MatchScorecard
              battingTeamId={battingTeamId!}
              bowlingTeamId={bowlingTeamId!}
              battingPlayers={getBattingPlayers()}
              bowlingPlayers={getBowlingPlayers()}
              currentOver={currentOver}
              totalOvers={totalOvers}
              lastBowlerId={lastBowlerId}
              strikerId={strikerId}
              nonStrikerId={nonStrikerId}
              onStrikerChange={setStrikerId}
              onNonStrikerChange={setNonStrikerId}
              isOverInProgress={currentOverBalls.length > 0}
              onBallSubmit={handleBallSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
