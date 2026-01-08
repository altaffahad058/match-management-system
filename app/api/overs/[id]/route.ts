import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/overs/[id] - Get a single over by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const overId = parseInt(id);

    if (isNaN(overId)) {
      return NextResponse.json(
        { error: 'Invalid over ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to fetch an over by ID with bowler information
    // Query should: SELECT over with bowler name via JOIN
    // Expected columns: id, innings_id, over_number, bowler_id, bowler_name
    const over = await queryOne(``, [overId]);

    if (!over) {
      return NextResponse.json(
        { error: 'Over not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(over);
  } catch (error) {
    console.error('Error fetching over:', error);
    return NextResponse.json(
      { error: 'Failed to fetch over' },
      { status: 500 }
    );
  }
}

// DELETE /api/overs/[id] - Delete an over
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const overId = parseInt(id);

    if (isNaN(overId)) {
      return NextResponse.json(
        { error: 'Invalid over ID' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to delete an over
    // Query should: DELETE over with matching id
    // Consider: Should this cascade delete related records (balls)? 
    // Or should it fail if over has related data?
    await query(``, [overId]);

    return NextResponse.json({ message: 'Over deleted successfully' });
  } catch (error) {
    console.error('Error deleting over:', error);
    return NextResponse.json(
      { error: 'Failed to delete over' },
      { status: 500 }
    );
  }
}

