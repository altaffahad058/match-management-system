import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cricket Management System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Manage teams, players, matches, and detailed match statistics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link
            href="/teams"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Teams
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage cricket teams and their information
            </p>
          </Link>

          <Link
            href="/players"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Players
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage player profiles and team assignments
            </p>
          </Link>

          <Link
            href="/matches"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Matches
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage matches with detailed statistics
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
