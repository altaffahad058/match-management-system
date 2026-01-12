import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/connection";
import "@/lib/db/init";

// GET /api/teams - Get all teams
export async function GET() {
  try {
    // TODO: Write SQL query to fetch all teams
    // Query should: SELECT all columns from Teams table, ordered by name
    // Expected columns: id, name, country_code
    const teams = await query(`SELECT * FROM Teams ORDER BY name`);

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, country_code } = body;

    if (!name || !country_code) {
      return NextResponse.json(
        { error: "Name and country_code are required" },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to insert a new team
    // Query should: INSERT a new team with name and country_code, return the created team
    // Use RETURNING clause to get the inserted row
    const team = await queryOne(
      `INSERT INTO Teams (name, country_code) VALUES ($1, $2) RETURNING id, name, country_code`,
      [name, country_code]
    );

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
