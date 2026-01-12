"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Match {
  id: number;
  team1_name: string;
  team2_name: string;
  match_date: string;
  venue: string;
  status: "scheduled" | "live" | "completed";
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🏏 Cricket Management System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete cricket match management and scoring system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold mb-4">Manage Teams & Players</h2>
            <div className="flex gap-4">
              <Link
                href="/teams"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Teams
              </Link>
              <Link
                href="/players"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Players
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold mb-4">New Match</h2>
            <Link
              href="/matches"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
            >
              Create Match
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Matches
        </h2>

        {loading ? (
          <div className="text-center py-8">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No matches found. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <Link
                href={`/matches/${match.id}`}
                key={match.id}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 block"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        match.status
                      )}`}
                    >
                      {match.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(match.match_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">
                    {match.team1_name} <span className="text-gray-400">vs</span>{" "}
                    {match.team2_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {match.venue}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
