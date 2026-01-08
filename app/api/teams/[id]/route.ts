import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/teams/[id] - Get a single team by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);

    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to fetch a team by ID
    // Query should: SELECT team with matching id
    // Expected columns: id, name, country_code
    const team = await queryOne(``, [teamId]);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

// PUT /api/teams/[id] - Update a team
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);
    const body = await request.json();
    const { name, country_code } = body;

    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      );
    }

    if (!name || !country_code) {
      return NextResponse.json(
        { error: 'Name and country_code are required' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to update a team
    // Query should: UPDATE team with matching id, set name and country_code, return updated team
    // Use RETURNING clause to get the updated row
    const team = await queryOne(``, [name, country_code, teamId]);

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/[id] - Delete a team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);

    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to delete a team
    // Query should: DELETE team with matching id
    // Consider: Should this cascade delete related records (players, matches)? Or should it fail if team has related data?
    await query(``, [teamId]);

    return NextResponse.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    );
  }
}

