import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/balls/[id] - Get a single ball by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ballId = parseInt(id);

    if (isNaN(ballId)) {
      return NextResponse.json(
        { error: 'Invalid ball ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to fetch a ball by ID with player information
    // Query should: SELECT ball with batsman, bowler, and out_player names via JOINs
    // Expected columns: id, over_id, ball_number, batsman_id, bowler_id, 
    //                   runs_off_bat, extra_type, extra_runs, is_legal_delivery,
    //                   wicket_type, out_player_id,
    //                   batsman_name, bowler_name, out_player_name
    const ball = await queryOne(``, [ballId]);

    if (!ball) {
      return NextResponse.json(
        { error: 'Ball not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ball);
  } catch (error) {
    console.error('Error fetching ball:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ball' },
      { status: 500 }
    );
  }
}

// PUT /api/balls/[id] - Update a ball
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ballId = parseInt(id);
    const body = await request.json();
    const {
      over_id,
      ball_number,
      batsman_id,
      bowler_id,
      runs_off_bat,
      extra_type,
      extra_runs,
      is_legal_delivery,
      wicket_type,
      out_player_id
    } = body;

    if (isNaN(ballId)) {
      return NextResponse.json(
        { error: 'Invalid ball ID' },
        { status: 400 }
      );
    }

    // Validate extra_type if provided
    if (extra_type && !['no_ball', 'wide', 'bye', 'leg_bye'].includes(extra_type)) {
      return NextResponse.json(
        { error: 'extra_type must be one of: no_ball, wide, bye, leg_bye' },
        { status: 400 }
      );
    }

    // Validate wicket_type if provided
    if (wicket_type && !['caught', 'run_out', 'bowled', 'lbw'].includes(wicket_type)) {
      return NextResponse.json(
        { error: 'wicket_type must be one of: caught, run_out, bowled, lbw' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to update a ball
    // Query should: UPDATE ball with matching id, set all provided fields
    // Handle NULL values for optional fields
    // Use RETURNING clause to get the updated row
    const ball = await queryOne(``, [
      parseInt(over_id),
      parseInt(ball_number),
      parseInt(batsman_id),
      parseInt(bowler_id),
      parseInt(runs_off_bat),
      extra_type || null,
      extra_runs !== undefined ? parseInt(extra_runs) : null,
      is_legal_delivery,
      wicket_type || null,
      out_player_id ? parseInt(out_player_id) : null,
      ballId
    ]);

    if (!ball) {
      return NextResponse.json(
        { error: 'Ball not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ball);
  } catch (error) {
    console.error('Error updating ball:', error);
    return NextResponse.json(
      { error: 'Failed to update ball' },
      { status: 500 }
    );
  }
}

// DELETE /api/balls/[id] - Delete a ball
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ballId = parseInt(id);

    if (isNaN(ballId)) {
      return NextResponse.json(
        { error: 'Invalid ball ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to delete a ball
    // Query should: DELETE ball with matching id
    await query(``, [ballId]);

    return NextResponse.json({ message: 'Ball deleted successfully' });
  } catch (error) {
    console.error('Error deleting ball:', error);
    return NextResponse.json(
      { error: 'Failed to delete ball' },
      { status: 500 }
    );
  }
}

