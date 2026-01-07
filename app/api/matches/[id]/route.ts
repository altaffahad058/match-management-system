import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/matches/[id] - Get a single match by ID with full details
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

    // TODO: Write SQL query to fetch a match by ID with team information
    // Query should: SELECT match with team names via JOINs
    // JOIN teams table for team1, team2, and toss_winner
    // Expected columns: id, team1_id, team2_id, team1_name, team2_name, 
    //                   toss_winner_team_id, toss_winner_team_name, elected_to, match_date, venue
    const match = await queryOne(``, [matchId]);

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}

// PUT /api/matches/[id] - Update a match
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id);
    const body = await request.json();
    const { team1_id, team2_id, toss_winner_team_id, elected_to, match_date, venue } = body;

    if (isNaN(matchId)) {
      return NextResponse.json(
        { error: 'Invalid match ID' },
        { status: 400 }
      );
    }

    if (!team1_id || !team2_id || !toss_winner_team_id || !elected_to || !match_date || !venue) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (team1_id === team2_id) {
      return NextResponse.json(
        { error: 'Team 1 and Team 2 must be different' },
        { status: 400 }
      );
    }

    if (!['bat', 'bowl'].includes(elected_to)) {
      return NextResponse.json(
        { error: 'elected_to must be either "bat" or "bowl"' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to update a match
    // Query should: UPDATE match with matching id, set all fields
    // Use RETURNING clause to get the updated row
    const match = await queryOne(``, [parseInt(team1_id), parseInt(team2_id), parseInt(toss_winner_team_id), elected_to, match_date, venue, matchId]);

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
}

// DELETE /api/matches/[id] - Delete a match
export async function DELETE(
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

    // TODO: Write SQL query to delete a match
    // Query should: DELETE match with matching id
    // Consider: Should this cascade delete related records (playing_xi, innings, etc.)? 
    // Or should it fail if match has related data?
    await query(``, [matchId]);

    return NextResponse.json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    );
  }
}

