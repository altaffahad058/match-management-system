import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/connection";
import "@/lib/db/init";

// GET /api/players - Get all players (optionally filtered by team_id)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("team_id");

    // TODO: Write SQL query to fetch players
    // If team_id is provided: SELECT players filtered by team_id, include team name via JOIN
    // If no team_id: SELECT all players, include team name via JOIN
    // Query should: JOIN with teams table to get team name
    // Expected columns: id, name, date_of_birth, role, team_id, team_name (from JOIN)
    // Order by player name
    const players = await query(
      `SELECT p.id, p.name, p.date_of_birth::text AS date_of_birth, p.role, p.team_id, t.name AS team_name
       FROM Players p
       INNER JOIN Teams t ON t.id = p.team_id
       ${teamId ? 'WHERE p.team_id = $1' : ''}
       ORDER BY p.name`,
      teamId ? [parseInt(teamId)] : undefined
    );

    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

// POST /api/players - Create a new player
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date_of_birth, role, team_id } = body;

    if (!name || !date_of_birth || !role || !team_id) {
      return NextResponse.json(
        { error: "Name, date_of_birth, role, and team_id are required" },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to insert a new player
    // Query should: INSERT a new player with name, date_of_birth, role, team_id
    // Validate that team_id exists in teams table (or let foreign key constraint handle it)
    // Use RETURNING clause to get the created player
    const player = await queryOne(
      `INSERT INTO Players (name, date_of_birth, role, team_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, date_of_birth::text AS date_of_birth, role, team_id`,
      [name, date_of_birth, role, parseInt(team_id)]
    );

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
