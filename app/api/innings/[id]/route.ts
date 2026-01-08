import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/innings/[id] - Get a single innings by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inningsId = parseInt(id);

    if (isNaN(inningsId)) {
      return NextResponse.json(
        { error: 'Invalid innings ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to fetch an innings by ID with team information
    // Query should: SELECT innings with team names via JOINs
    // Expected columns: id, match_id, batting_team_id, bowling_team_id, innings_number,
    //                   batting_team_name, bowling_team_name
    const innings = await queryOne(``, [inningsId]);

    if (!innings) {
      return NextResponse.json(
        { error: 'Innings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(innings);
  } catch (error) {
    console.error('Error fetching innings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch innings' },
      { status: 500 }
    );
  }
}

// DELETE /api/innings/[id] - Delete an innings
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inningsId = parseInt(id);

    if (isNaN(inningsId)) {
      return NextResponse.json(
        { error: 'Invalid innings ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to delete an innings
    // Query should: DELETE innings with matching id
    // Consider: Should this cascade delete related records (overs, balls)? 
    // Or should it fail if innings has related data?
    await query(``, [inningsId]);

    return NextResponse.json({ message: 'Innings deleted successfully' });
  } catch (error) {
    console.error('Error deleting innings:', error);
    return NextResponse.json(
      { error: 'Failed to delete innings' },
      { status: 500 }
    );
  }
}

