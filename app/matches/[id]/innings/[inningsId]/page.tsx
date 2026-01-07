'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Innings {
  id: number;
  match_id: number;
  batting_team_id: number;
  bowling_team_id: number;
  innings_number: number;
  batting_team_name: string;
  bowling_team_name: string;
}

interface Over {
  id: number;
  innings_id: number;
  over_number: number;
  bowler_id: number;
  bowler_name: string;
}

interface Ball {
  id: number;
  over_id: number;
  ball_number: number;
  batsman_id: number;
  bowler_id: number;
  runs_off_bat: number;
  extra_type: string | null;
  extra_runs: number | null;
  is_legal_delivery: boolean;
  wicket_type: string | null;
  out_player_id: number | null;
  batsman_name: string;
  bowler_name: string;
  out_player_name: string | null;
}

export default function InningsDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  const inningsId = params.inningsId as string;
  
  const [innings, setInnings] = useState<Innings | null>(null);
  const [overs, setOvers] = useState<Over[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInnings();
    fetchOvers();
  }, [inningsId]);

  useEffect(() => {
    if (overs.length > 0) {
      fetchBalls();
    }
  }, [overs]);

  const fetchInnings = async () => {
    try {
      const response = await fetch(`/api/innings/${inningsId}`);
      const data = await response.json();
      setInnings(data);
    } catch (error) {
      console.error('Error fetching innings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOvers = async () => {
    try {
      const response = await fetch(`/api/overs?innings_id=${inningsId}`);
      const data = await response.json();
      setOvers(data);
    } catch (error) {
      console.error('Error fetching overs:', error);
    }
  };

  const fetchBalls = async () => {
    try {
      const overIds = overs.map(o => o.id);
      const allBalls: Ball[] = [];
      
      for (const overId of overIds) {
        const response = await fetch(`/api/balls?over_id=${overId}`);
        const data = await response.json();
        allBalls.push(...data);
      }
      
      setBalls(allBalls);
    } catch (error) {
      console.error('Error fetching balls:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!innings) {
    return <div className="p-8 text-center">Innings not found</div>;
  }

  const ballsByOver = overs.reduce((acc, over) => {
    acc[over.id] = balls.filter(b => b.over_id === over.id).sort((a, b) => a.ball_number - b.ball_number);
    return acc;
  }, {} as Record<number, Ball[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link
          href={`/matches/${matchId}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-4 inline-block"
        >
          ← Back to Match
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Innings {innings.innings_number}
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">Batting:</span> {innings.batting_team_name}
            </p>
            <p>
              <span className="font-medium">Bowling:</span> {innings.bowling_team_name}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Overs</h2>
          {overs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No overs recorded yet.</p>
          ) : (
            <div className="space-y-6">
              {overs.map((over) => (
                <div key={over.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Over {over.over_number}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Bowler: {over.bowler_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {ballsByOver[over.id]?.map((ball) => (
                      <div
                        key={ball.id}
                        className={`p-2 rounded text-center text-sm ${
                          ball.wicket_type
                            ? 'bg-red-100 dark:bg-red-900'
                            : ball.extra_type
                            ? 'bg-yellow-100 dark:bg-yellow-900'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {ball.runs_off_bat}
                          {ball.extra_runs ? `+${ball.extra_runs}` : ''}
                        </div>
                        {ball.wicket_type && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            W ({ball.wicket_type})
                          </div>
                        )}
                        {ball.extra_type && (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">
                            {ball.extra_type}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

