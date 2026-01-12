import { useState, useEffect } from "react";
import Link from "next/link";

interface MatchSummaryProps {
  matchId: number;
}

export default function MatchSummary({ matchId }: MatchSummaryProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [matchId]);

  const fetchSummary = async () => {
    try {
      const res = await fetch(`/api/matches/${matchId}/summary`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBattingStats = (inning: any) => {
    const stats: any = {};

    inning.overs.forEach((over: any) => {
      over.balls.forEach((ball: any) => {
        // Init stats for batsman if not exists
        if (!stats[ball.batsman_id]) {
          stats[ball.batsman_id] = {
            id: ball.batsman_id,
            name: ball.batsman_name,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: null,
          };
        }

        // Init stats for non-striker (to list them even if they didn't face a ball, though usually they face at least one or are at crease)
        // Hard to track non-striker just from balls without extra logic, but we can list all who batted

        // Update runs
        if (ball.extra_type !== "wide") {
          stats[ball.batsman_id].balls++;
        }
        stats[ball.batsman_id].runs += ball.runs_off_bat;

        if (ball.runs_off_bat === 4) stats[ball.batsman_id].fours++;
        if (ball.runs_off_bat === 6) stats[ball.batsman_id].sixes++;

        // Handle wicket
        if (ball.wicket_type && ball.out_player_id) {
          if (!stats[ball.out_player_id]) {
            stats[ball.out_player_id] = {
              id: ball.out_player_id,
              name: ball.out_player_name, // Might be missing if not invalid in this ball
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              out: null,
            };
          }
          stats[ball.out_player_id].out = ball.wicket_type;
        }
      });
    });

    return Object.values(stats);
  };

  const calculateBowlingStats = (inning: any) => {
    const stats: any = {};

    inning.overs.forEach((over: any) => {
      if (!stats[over.bowler_id]) {
        stats[over.bowler_id] = {
          id: over.bowler_id,
          name: over.bowler_name,
          overs: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
        };
      }

      let runsInOver = 0;
      let legalBalls = 0;
      let wickets = 0;

      over.balls.forEach((ball: any) => {
        const runs = ball.runs_off_bat + (ball.extra_runs || 0);

        // Extras accountability:
        // Wides/No Balls count to bowler? Yes.
        // Byes/Leg Byes do NOT count to bowler runs.
        if (ball.extra_type === "bye" || ball.extra_type === "leg_bye") {
          // No run added to bowler
        } else {
          runsInOver += runs;
        }

        if (ball.is_legal_delivery) {
          legalBalls++;
        }

        if (ball.wicket_type && ball.wicket_type !== "run_out") {
          wickets++;
        }
      });

      stats[over.bowler_id].runs += runsInOver;
      stats[over.bowler_id].wickets += wickets;

      // Calculate overs (simplistic: completed overs. Partials handled by float/string elsewhere?)
      // Standard: just count legal balls / 6
    });

    // Final pass for overs conversion
    Object.values(stats).forEach((s: any) => {
      // We need to recount accurate balls for s.
      // Re-looping slightly inefficient but okay for summary
      let totalLegalBalls = 0;
      inning.overs.forEach((o: any) => {
        if (o.bowler_id === s.id) {
          o.balls.forEach((b: any) => {
            if (b.is_legal_delivery) totalLegalBalls++;
          });
        }
      });
      const ovs = Math.floor(totalLegalBalls / 6);
      const rem = totalLegalBalls % 6;
      s.oversDisplay = `${ovs}.${rem}`;
    });

    return Object.values(stats);
  };

  if (loading) return <div>Loading Summary...</div>;
  if (!data) return <div>No Data</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">
          {data.match.team1_name} vs {data.match.team2_name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {data.match.venue} • {data.match.match_date}
        </p>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded text-center text-xl font-bold">
          Match Completed
        </div>
      </div>

      {data.innings.map((inning: any) => (
        <div
          key={inning.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <h2 className="text-2xl font-bold mb-4">
            {inning.batting_team_name} Innings
          </h2>

          <h3 className="text-lg font-semibold mb-2">Batting</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left mb-6">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Batter</th>
                  <th className="p-2">R</th>
                  <th className="p-2">B</th>
                  <th className="p-2">4s</th>
                  <th className="p-2">6s</th>
                  <th className="p-2">SR</th>
                </tr>
              </thead>
              <tbody>
                {calculateBattingStats(inning).map((batter: any) => (
                  <tr key={batter.id} className="border-b dark:border-gray-700">
                    <td className="p-2">
                      {batter.name}
                      {batter.out && (
                        <span className="text-red-500 text-sm ml-2">
                          ({batter.out})
                        </span>
                      )}
                      {!batter.out && (
                        <span className="text-green-500 text-sm ml-2">*</span>
                      )}
                    </td>
                    <td className="p-2 font-bold">{batter.runs}</td>
                    <td className="p-2">{batter.balls}</td>
                    <td className="p-2">{batter.fours}</td>
                    <td className="p-2">{batter.sixes}</td>
                    <td className="p-2">
                      {batter.balls > 0
                        ? ((batter.runs / batter.balls) * 100).toFixed(1)
                        : "0.0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold mb-2">Bowling</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Bowler</th>
                  <th className="p-2">O</th>
                  <th className="p-2">M</th>
                  <th className="p-2">R</th>
                  <th className="p-2">W</th>
                  <th className="p-2">Econ</th>
                </tr>
              </thead>
              <tbody>
                {calculateBowlingStats(inning).map((bowler: any) => (
                  <tr key={bowler.id} className="border-b dark:border-gray-700">
                    <td className="p-2">{bowler.name}</td>
                    <td className="p-2">{bowler.oversDisplay}</td>
                    <td className="p-2">-</td>
                    <td className="p-2">{bowler.runs}</td>
                    <td className="p-2 font-bold">{bowler.wickets}</td>
                    <td className="p-2">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="text-center">
        <Link
          href="/"
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
