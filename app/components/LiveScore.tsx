'use client';

interface LiveScoreProps {
  battingTeam: string;
  bowlingTeam: string;
  score: number;
  wickets: number;
  overs: string; // e.g., "12.3" for 12 overs and 3 balls
  runRate: number;
  requiredRuns?: number;
  requiredRunRate?: number;
}

export default function LiveScore({
  battingTeam,
  bowlingTeam,
  score,
  wickets,
  overs,
  runRate,
  requiredRuns,
  requiredRunRate,
}: LiveScoreProps) {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{battingTeam}</h2>
          <p className="text-green-100">vs {bowlingTeam}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{score}/{wickets}</div>
          <p className="text-green-100">Overs: {overs}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <p className="text-green-100 text-sm">Run Rate</p>
          <p className="text-xl font-semibold">{runRate.toFixed(2)}</p>
        </div>
        {requiredRuns !== undefined && (
          <>
            <div>
              <p className="text-green-100 text-sm">Required</p>
              <p className="text-xl font-semibold">{requiredRuns} runs</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Req. RR</p>
              <p className="text-xl font-semibold">{requiredRunRate?.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

