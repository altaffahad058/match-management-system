import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';
import '@/lib/db/init';

// GET /api/overs - Get all overs (optionally filtered by innings_id)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const inningsId = searchParams.get('innings_id');

    // TODO: Write SQL query to fetch overs
    // If innings_id is provided: SELECT overs filtered by innings_id
    // If no innings_id: SELECT all overs
    // JOIN with innings and players tables to get innings and bowler information
    // Expected columns: id, innings_id, over_number, bowler_id, bowler_name
    // Order by innings_id, then over_number
    const overs = await query(``, inningsId ? [parseInt(inningsId)] : undefined);

    return NextResponse.json(overs);
  } catch (error) {
    console.error('Error fetching overs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch overs' },
      { status: 500 }
    );
  }
}

// POST /api/overs - Create a new over
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { innings_id, over_number, bowler_id } = body;

    if (!innings_id || over_number === undefined || !bowler_id) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to insert a new over
    // Query should: INSERT a new over with innings_id, over_number, bowler_id
    // Validate that innings_id and bowler_id exist
    // Check that over_number is unique for the innings (or allow duplicates if needed)
    // Use RETURNING clause to get the created over
    const over = await query(``, [parseInt(innings_id), parseInt(over_number), parseInt(bowler_id)]);

    return NextResponse.json(over[0], { status: 201 });
  } catch (error) {
    console.error('Error creating over:', error);
    return NextResponse.json(
      { error: 'Failed to create over' },
      { status: 500 }
    );
  }
}

