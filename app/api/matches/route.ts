import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/matches - Get all matches
export async function GET() {
  try {
    // TODO: Write SQL query to fetch all matches with team information
    // Query should: SELECT matches with team names via JOINs
    // JOIN teams table three times (once for team1, once for team2, once for toss_winner)
    // Expected columns: id, team1_id, team2_id, team1_name, team2_name, 
    //                   toss_winner_team_id, toss_winner_team_name, elected_to, match_date, venue
    // Order by match_date DESC (most recent first)
    const matches = await query(``);

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST /api/matches - Create a new match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { team1_id, team2_id, toss_winner_team_id, elected_to, match_date, venue } = body;

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

    // TODO: Write SQL query to insert a new match
    // Query should: INSERT a new match with all required fields
    // Validate that team1_id, team2_id, and toss_winner_team_id exist in teams table
    // Use RETURNING clause to get the created match
    const match = await query(``, [parseInt(team1_id), parseInt(team2_id), parseInt(toss_winner_team_id), elected_to, match_date, venue]);

    return NextResponse.json(match[0], { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}

