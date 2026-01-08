import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🏏 Cricket Management System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Complete cricket match management and scoring system
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            Manage teams, players, and score matches ball-by-ball
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="/teams"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create and manage cricket teams with country codes
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
              Manage Teams →
            </span>
          </Link>

          <Link
            href="/players"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500"
          >
            <div className="text-4xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              Players
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage player profiles, roles, and team assignments
            </p>
            <span className="text-green-600 dark:text-green-400 font-medium group-hover:underline">
              Manage Players →
            </span>
          </Link>

          <Link
            href="/matches"
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500"
          >
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Matches
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create matches, select playing XI, and score ball-by-ball
            </p>
            <span className="text-purple-600 dark:text-purple-400 font-medium group-hover:underline">
              Manage Matches →
            </span>
          </Link>
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Start Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Create Teams</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add cricket teams</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center font-bold text-green-600 dark:text-green-400">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Add Players</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Register players to teams</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Create Match</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set up a new match</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center font-bold text-orange-600 dark:text-orange-400">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Start Scoring</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Record match ball-by-ball</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
