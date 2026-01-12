import { NextRequest, NextResponse } from "next/server";
import { queryOne, query } from "@/lib/db/connection";
import "@/lib/db/init";

// GET /api/matches/[id] - Get a single match by ID with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }

    // TODO: Write SQL query to fetch a match by ID with team information
    // Query should: SELECT match with team names via JOINs
    // JOIN teams table for team1, team2, and toss_winner
    // Expected columns: id, team1_id, team2_id, team1_name, team2_name,
    //                   toss_winner_team_id, toss_winner_team_name, elected_to, match_date, venue
    const match = await queryOne(
      `SELECT m.id, m.team1_id, m.team2_id, t1.name AS team1_name, t2.name AS team2_name, t.name AS toss_winner_team_name, m.toss_winner_team_id, m.elected_to, m.match_date::text AS match_date, m.venue, m.total_overs, m.status
      FROM Matches m
      INNER JOIN Teams t1 ON m.team1_id = t1.id
      INNER JOIN Teams t2 ON m.team2_id = t2.id
      INNER JOIN Teams t ON m.toss_winner_team_id = t.id
      WHERE m.id = $1`,
      [matchId]
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error fetching match:", error);
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 }
    );
  }
}

// PUT /api/matches/[id] - Update a match
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id);
    const body = await request.json();
    const {
      team1_id,
      team2_id,
      toss_winner_team_id,
      elected_to,
      match_date,
      venue,
    } = body;

    if (isNaN(matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }

    if (
      !team1_id ||
      !team2_id ||
      !toss_winner_team_id ||
      !elected_to ||
      !match_date ||
      !venue
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (team1_id === team2_id) {
      return NextResponse.json(
        { error: "Team 1 and Team 2 must be different" },
        { status: 400 }
      );
    }

    if (!["bat", "bowl"].includes(elected_to)) {
      return NextResponse.json(
        { error: 'elected_to must be either "bat" or "bowl"' },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to update a match
    // Query should: UPDATE match with matching id, set all fields
    // Use RETURNING clause to get the updated row
    const match = await queryOne(
      `
      UPDATE Matches SET team1_id = $1, team2_id = $2, toss_winner_team_id = $3, elected_to = $4, match_date = $5, venue = $6, total_overs = $7, status = $8
      WHERE id = $9
      RETURNING id, team1_id, team2_id, toss_winner_team_id, elected_to, match_date::text AS match_date, venue, total_overs, status`,
      [
        parseInt(team1_id),
        parseInt(team2_id),
        parseInt(toss_winner_team_id),
        elected_to,
        match_date,
        venue,
        body.total_overs || null,
        body.status || "scheduled",
        matchId,
      ]
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Error updating match:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}

// DELETE /api/matches/[id] - Delete a match
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id);

    if (isNaN(matchId)) {
      return NextResponse.json({ error: "Invalid match ID" }, { status: 400 });
    }

    // TODO: Write SQL query to delete a match
    // Query should: DELETE match with matching id
    // Consider: Should this cascade delete related records (playing_xi, innings, etc.)?
    // Or should it fail if match has related data?
    await query(`DELETE FROM Matches WHERE id = $1`, [matchId]);

    return NextResponse.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error deleting match:", error);
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    );
  }
}
