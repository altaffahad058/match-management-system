import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/connection";
import "@/lib/db/init";

// GET /api/innings - Get all innings (optionally filtered by match_id)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const matchId = searchParams.get("match_id");

    // TODO: Write SQL query to fetch innings
    // If match_id is provided: SELECT innings filtered by match_id
    // If no match_id: SELECT all innings
    // JOIN with matches and teams tables to get match and team information
    // Expected columns: id, match_id, batting_team_id, bowling_team_id, innings_number,
    //                   batting_team_name, bowling_team_name, match_date
    // Order by match_id, then innings_number
    const innings = await query(
      `
      SELECT i.id, i.match_id, i.batting_team_id, i.bowling_team_id,
      i.innings_number, t1.name as batting_team_name, t2.name as bowling_team_name,
      m.match_date
      FROM Innings i
      INNER JOIN Teams t1 ON i.batting_team_id = t1.id
      INNER JOIN Teams t2 ON i.bowling_team_id = t2.id
      INNER JOIN Matches m ON i.match_id = m.id
      WHERE i.match_id = $1
      ORDER BY i.match_id, i.innings_number`,
      matchId ? [parseInt(matchId)] : undefined
    );

    return NextResponse.json(innings);
  } catch (error) {
    console.error("Error fetching innings:", error);
    return NextResponse.json(
      { error: "Failed to fetch innings" },
      { status: 500 }
    );
  }
}

// POST /api/innings - Create a new innings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { match_id, batting_team_id, bowling_team_id, innings_number } = body;

    if (!match_id || !batting_team_id || !bowling_team_id || !innings_number) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (batting_team_id === bowling_team_id) {
      return NextResponse.json(
        { error: "Batting team and bowling team must be different" },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to insert a new innings
    // Query should: INSERT a new innings with all required fields
    // Validate that match_id, batting_team_id, and bowling_team_id exist
    // Check that innings_number is unique for the match (or allow duplicates if needed)
    // Use RETURNING clause to get the created innings
    const innings = await query(
      `
      INSERT INTO Innings (match_id, batting_team_id, bowling_team_id, innings_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        parseInt(match_id),
        parseInt(batting_team_id),
        parseInt(bowling_team_id),
        parseInt(innings_number),
      ]
    );

    return NextResponse.json(innings[0], { status: 201 });
  } catch (error) {
    console.error("Error creating innings:", error);
    return NextResponse.json(
      { error: "Failed to create innings" },
      { status: 500 }
    );
  }
}
