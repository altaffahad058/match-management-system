import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/matches/[id]/playing-xi - Get playing XI for a match
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id);

    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'Invalid match ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to fetch playing XI for a match
    // Query should: SELECT players in playing XI for the given match
    // JOIN with players and teams tables to get player and team names
    // Filter by is_playing_xi = true
    // Expected columns: id, match_id, team_id, player_id, is_playing_xi, 
    //                   player_name, team_name
    // Order by team_id, then player name
    const playingXI = await query(``, [matchId]);

    return NextResponse.json(playingXI);
  } catch (error) {
    console.error('Error fetching playing XI:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playing XI' },
      { status: 500 }
    );
  }
}

// POST /api/matches/[id]/playing-xi - Add players to playing XI
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id);
    const body = await request.json();
    const { players } = body; // Array of { team_id, player_id, is_playing_xi }

    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'Invalid match ID' },
        { status: 400 }
      );
    }

    if (!Array.isArray(players) || players.length === 0) {
      return NextResponse.json(
        { error: 'Players array is required' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to insert multiple playing XI entries
    // Query should: INSERT multiple rows into playing_xi table
    // Each row should have: match_id, team_id, player_id, is_playing_xi
    // Use a transaction or batch insert
    // Validate that match_id, team_id, and player_id exist
    // Return all inserted rows
    // Note: players array contains { team_id, player_id, is_playing_xi } objects
    const inserted = await query(``);

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error('Error creating playing XI:', error);
    return NextResponse.json(
      { error: 'Failed to create playing XI' },
      { status: 500 }
    );
  }
}

