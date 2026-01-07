'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Match {
  id: number;
  team1_id: number;
  team2_id: number;
  team1_name: string;
  team2_name: string;
  toss_winner_team_id: number;
  toss_winner_team_name: string;
  elected_to: string;
  match_date: string;
  venue: string;
}

interface Innings {
  id: number;
  match_id: number;
  batting_team_id: number;
  bowling_team_id: number;
  innings_number: number;
  batting_team_name: string;
  bowling_team_name: string;
}

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;
  
  const [match, setMatch] = useState<Match | null>(null);
  const [innings, setInnings] = useState<Innings[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'innings'>('overview');

  useEffect(() => {
    fetchMatch();
    fetchInnings();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`);
      const data = await response.json();
      setMatch(data);
    } catch (error) {
      console.error('Error fetching match:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInnings = async () => {
    try {
      const response = await fetch(`/api/innings?match_id=${matchId}`);
      const data = await response.json();
      setInnings(data);
    } catch (error) {
      console.error('Error fetching innings:', error);
    }
  };

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
          href="/matches"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mb-4 inline-block"
        >
          ← Back to Matches
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {match.team1_name} vs {match.team2_name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>{' '}
              <span className="text-gray-900 dark:text-white">
                {new Date(match.match_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Venue:</span>{' '}
              <span className="text-gray-900 dark:text-white">{match.venue}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Toss Winner:</span>{' '}
              <span className="text-gray-900 dark:text-white">{match.toss_winner_team_name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Elected To:</span>{' '}
              <span className="text-gray-900 dark:text-white capitalize">{match.elected_to}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('innings')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'innings'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Innings ({innings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Match Overview
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed match statistics and playing XI will be displayed here.
                </p>
              </div>
            )}

            {activeTab === 'innings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Innings
                </h2>
                {innings.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">No innings recorded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {innings.map((inn) => (
                      <div
                        key={inn.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Innings {inn.innings_number}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {inn.batting_team_name} batting vs {inn.bowling_team_name}
                            </p>
                          </div>
                          <Link
                            href={`/matches/${matchId}/innings/${inn.id}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

