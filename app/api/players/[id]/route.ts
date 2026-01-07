import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/players/[id] - Get a single player by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id);

    if (isNaN(playerId)) {
      return NextResponse.json(
        { error: 'Invalid player ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to fetch a player by ID with team information
    // Query should: SELECT player with matching id, JOIN with teams to get team name
    // Expected columns: id, name, date_of_birth, role, team_id, team_name
    const player = await queryOne(``, [playerId]);

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

// PUT /api/players/[id] - Update a player
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id);
    const body = await request.json();
    const { name, date_of_birth, role, team_id } = body;

    if (isNaN(playerId)) {
      return NextResponse.json(
        { error: 'Invalid player ID' },
        { status: 400 }
      );
    }

    if (!name || !date_of_birth || !role || !team_id) {
      return NextResponse.json(
        { error: 'Name, date_of_birth, role, and team_id are required' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to update a player
    // Query should: UPDATE player with matching id, set name, date_of_birth, role, team_id
    // Use RETURNING clause to get the updated row
    const player = await queryOne(``, [name, date_of_birth, role, parseInt(team_id), playerId]);

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

// DELETE /api/players/[id] - Delete a player
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = parseInt(params.id);

    if (isNaN(playerId)) {
      return NextResponse.json(
        { error: 'Invalid player ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to delete a player
    // Query should: DELETE player with matching id
    // Consider: Should this cascade delete related records? Or should it fail if player has related data?
    await query(``, [playerId]);

    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}

