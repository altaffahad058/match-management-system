import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/connection";
import "@/lib/db/init";

// GET /api/balls - Get all balls (optionally filtered by over_id)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const overId = searchParams.get("over_id");

    // TODO: Write SQL query to fetch balls
    // If over_id is provided: SELECT balls filtered by over_id
    // If no over_id: SELECT all balls
    // JOIN with overs, players (batsman), players (bowler), and players (out_player) tables
    // Expected columns: id, over_id, ball_number, batsman_id, bowler_id,
    //                   runs_off_bat, extra_type, extra_runs, is_legal_delivery,
    //                   wicket_type, out_player_id,
    //                   batsman_name, bowler_name, out_player_name
    // Order by over_id, then ball_number
    const balls = await query(
      `
      SELECT b.id, b.over_id, b.ball_number, b.batsman_id, b.bowler_id,
      b.runs_off_bat, b.extra_type, b.extra_runs, b.is_legal_delivery,
      b.wicket_type, b.out_player_id,
      pbat.name as batsman_name, pbowl.name as bowler_name, pout.name as out_player_name
      FROM Balls b
      INNER JOIN Overs o ON b.over_id = o.id
      INNER JOIN Players pbat ON b.batsman_id = pbat.id
      INNER JOIN Players pbowl ON b.bowler_id = pbowl.id
      INNER JOIN Players pout ON b.out_player_id = pout.id
      WHERE b.over_id = $1
      ORDER BY b.over_id, b.ball_number`,
      overId ? [parseInt(overId)] : undefined
    );

    return NextResponse.json(balls);
  } catch (error) {
    console.error("Error fetching balls:", error);
    return NextResponse.json(
      { error: "Failed to fetch balls" },
      { status: 500 }
    );
  }
}

// POST /api/balls - Create a new ball
export async function POST(request: NextRequest) {
  try {
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
      out_player_id,
    } = body;

    if (
      !over_id ||
      ball_number === undefined ||
      !batsman_id ||
      !bowler_id ||
      runs_off_bat === undefined ||
      is_legal_delivery === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "over_id, ball_number, batsman_id, bowler_id, runs_off_bat, and is_legal_delivery are required",
        },
        { status: 400 }
      );
    }

    // Validate extra_type if provided
    if (
      extra_type &&
      !["no_ball", "wide", "bye", "leg_bye"].includes(extra_type)
    ) {
      return NextResponse.json(
        { error: "extra_type must be one of: no_ball, wide, bye, leg_bye" },
        { status: 400 }
      );
    }

    // Validate wicket_type if provided
    if (
      wicket_type &&
      !["caught", "run_out", "bowled", "lbw"].includes(wicket_type)
    ) {
      return NextResponse.json(
        { error: "wicket_type must be one of: caught, run_out, bowled, lbw" },
        { status: 400 }
      );
    }

    // TODO: Write SQL query to insert a new ball
    // Query should: INSERT a new ball with all provided fields
    // Handle NULL values for optional fields (extra_type, extra_runs, wicket_type, out_player_id)
    // Validate that over_id, batsman_id, bowler_id, and out_player_id (if provided) exist
    // Use RETURNING clause to get the created ball
    const ball = await query(
      `
      INSERT INTO Balls (over_id, ball_number, batsman_id, bowler_id, runs_off_bat, extra_type, extra_runs, is_legal_delivery, wicket_type, out_player_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        parseInt(over_id),
        parseInt(ball_number),
        parseInt(batsman_id),
        parseInt(bowler_id),
        parseInt(runs_off_bat),
        extra_type || null,
        extra_runs !== undefined && extra_runs !== null
          ? parseInt(extra_runs)
          : 0,
        is_legal_delivery,
        wicket_type || null,
        out_player_id ? parseInt(out_player_id) : null,
      ]
    );

    return NextResponse.json(ball[0], { status: 201 });
  } catch (error) {
    console.error("Error creating ball:", error);
    return NextResponse.json(
      { error: "Failed to create ball" },
      { status: 500 }
    );
  }
}
