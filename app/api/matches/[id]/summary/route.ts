import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/connection";
import "@/lib/db/init";

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

    // Fetch match details
    const match = await queryOne(
      `
      SELECT m.id, m.team1_id, m.team2_id, t1.name AS team1_name, t2.name AS team2_name,
      m.toss_winner_team_id, m.elected_to, m.match_date::text, m.venue
      FROM Matches m
      INNER JOIN Teams t1 ON m.team1_id = t1.id
      INNER JOIN Teams t2 ON m.team2_id = t2.id
      WHERE m.id = $1`,
      [matchId]
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Fetch innings
    const innings = await query(
      `
      SELECT i.id, i.match_id, i.batting_team_id, i.bowling_team_id, i.innings_number,
      t1.name AS batting_team_name, t2.name AS bowling_team_name
      FROM Innings i
      INNER JOIN Teams t1 ON i.batting_team_id = t1.id
      INNER JOIN Teams t2 ON i.bowling_team_id = t2.id
      WHERE i.match_id = $1
      ORDER BY i.innings_number`,
      [matchId]
    );

    // Fetch all overs for these innings
    const inningsIds = innings.map((i: any) => i.id);
    let overs: any[] = [];
    if (inningsIds.length > 0) {
      overs = await query(
        `
        SELECT o.id, o.innings_id, o.over_number, o.bowler_id, p.name as bowler_name
        FROM Overs o
        INNER JOIN Players p ON o.bowler_id = p.id
        WHERE o.innings_id = ANY($1)
        ORDER BY o.innings_id, o.over_number`,
        [inningsIds]
      );
    }

    // Fetch all balls for these overs
    const overIds = overs.map((o: any) => o.id);
    let balls: any[] = [];
    if (overIds.length > 0) {
      balls = await query(
        `
        SELECT b.*,
        pbat.name as batsman_name, pbowl.name as bowler_name, pout.name as out_player_name
        FROM Balls b
        INNER JOIN Players pbat ON b.batsman_id = pbat.id
        INNER JOIN Players pbowl ON b.bowler_id = pbowl.id
        LEFT JOIN Players pout ON b.out_player_id = pout.id
        WHERE b.over_id = ANY($1)
        ORDER BY b.over_id, b.ball_number`,
        [overIds]
      );
    }

    // Map balls to overs
    const ballsByOverId = new Map<number, any[]>();
    balls.forEach((ball) => {
      if (!ballsByOverId.has(ball.over_id)) {
        ballsByOverId.set(ball.over_id, []);
      }
      ballsByOverId.get(ball.over_id)?.push(ball);
    });

    overs.forEach((over) => {
      over.balls = ballsByOverId.get(over.id) || [];
    });

    // Map overs to innings
    const oversByInningsId = new Map<number, any[]>();
    overs.forEach((over) => {
      if (!oversByInningsId.has(over.innings_id)) {
        oversByInningsId.set(over.innings_id, []);
      }
      oversByInningsId.get(over.innings_id)?.push(over);
    });

    innings.forEach((inning: any) => {
      inning.overs = oversByInningsId.get(inning.id) || [];
    });

    return NextResponse.json({ match, innings });
  } catch (error) {
    console.error("Error fetching match summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch match summary" },
      { status: 500 }
    );
  }
}
