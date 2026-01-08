'use client';

import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  role: string;
  team_id: number;
}

interface PlayingXISelectorProps {
  teamId: number;
  teamName: string;
  availablePlayers: Player[];
  selectedPlayers: number[];
  onSelectionChange: (playerIds: number[]) => void;
}

export default function PlayingXISelector({
  teamId,
  teamName,
  availablePlayers,
  selectedPlayers,
  onSelectionChange,
}: PlayingXISelectorProps) {
  const togglePlayer = (playerId: number) => {
    if (selectedPlayers.includes(playerId)) {
      onSelectionChange(selectedPlayers.filter(id => id !== playerId));
    } else {
      if (selectedPlayers.length < 11) {
        onSelectionChange([...selectedPlayers, playerId]);
      } else {
        alert('You can only select 11 players');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {teamName} - Select Playing XI ({selectedPlayers.length}/11)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availablePlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => togglePlayer(player.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedPlayers.includes(player.id)
                ? 'border-green-500 bg-green-50 dark:bg-green-900'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{player.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{player.role}</p>
              </div>
              {selectedPlayers.includes(player.id) && (
                <span className="text-green-600 dark:text-green-400">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

