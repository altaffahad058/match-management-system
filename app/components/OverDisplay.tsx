'use client';

interface Ball {
  id?: number;
  ball_number: number;
  runs_off_bat: number;
  extra_type: string | null;
  extra_runs: number | null;
  wicket_type: string | null;
  is_legal_delivery: boolean;
}

interface OverDisplayProps {
  overNumber: number;
  balls: Ball[];
}

export default function OverDisplay({ overNumber, balls }: OverDisplayProps) {
  const totalRuns = balls.reduce((sum, ball) => {
    return sum + ball.runs_off_bat + (ball.extra_runs || 0);
  }, 0);

  const wickets = balls.filter(ball => ball.wicket_type).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Over {overNumber}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalRuns} runs {wickets > 0 && `• ${wickets} wicket${wickets > 1 ? 's' : ''}`}
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {balls.map((ball, index) => (
          <div
            key={index}
            className={`px-3 py-2 rounded text-sm font-medium ${
              ball.wicket_type
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : ball.extra_type
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                : ball.runs_off_bat > 0
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            <div className="font-bold">{ball.runs_off_bat}</div>
            {ball.extra_runs && ball.extra_runs > 0 && (
              <div className="text-xs">+{ball.extra_runs}</div>
            )}
            {ball.wicket_type && (
              <div className="text-xs">W</div>
            )}
            {ball.extra_type && (
              <div className="text-xs">{ball.extra_type}</div>
            )}
          </div>
        ))}
        {balls.length < 6 && (
          <div className="px-3 py-2 rounded text-sm bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
            ...
          </div>
        )}
      </div>
    </div>
  );
}

