# SQL Query TODOs

This document lists all the SQL queries that need to be implemented. Each API route has TODO comments indicating what queries are needed.

## Database Connection

The database connection is set up in `lib/db/connection.ts`. Make sure to:
1. Set `DATABASE_URL` environment variable
2. Initialize the database connection (done automatically via `lib/db/init.ts`)

## Teams API (`/api/teams`)

### GET /api/teams
- **File**: `app/api/teams/route.ts`
- **Query needed**: SELECT all teams ordered by name
- **Columns**: id, name, country_code

### POST /api/teams
- **File**: `app/api/teams/route.ts`
- **Query needed**: INSERT new team with name and country_code
- **Return**: Created team using RETURNING clause

### GET /api/teams/[id]
- **File**: `app/api/teams/[id]/route.ts`
- **Query needed**: SELECT team by ID
- **Columns**: id, name, country_code

### PUT /api/teams/[id]
- **File**: `app/api/teams/[id]/route.ts`
- **Query needed**: UPDATE team by ID
- **Return**: Updated team using RETURNING clause

### DELETE /api/teams/[id]
- **File**: `app/api/teams/[id]/route.ts`
- **Query needed**: DELETE team by ID
- **Note**: Consider cascade delete or foreign key constraints

## Players API (`/api/players`)

### GET /api/players
- **File**: `app/api/players/route.ts`
- **Query needed**: SELECT players with team names via JOIN
- **Optional filter**: Filter by team_id if provided
- **Columns**: id, name, date_of_birth, role, team_id, team_name (from JOIN)
- **Order**: By player name

### POST /api/players
- **File**: `app/api/players/route.ts`
- **Query needed**: INSERT new player
- **Columns**: name, date_of_birth, role, team_id
- **Return**: Created player using RETURNING clause

### GET /api/players/[id]
- **File**: `app/api/players/[id]/route.ts`
- **Query needed**: SELECT player by ID with team information via JOIN
- **Columns**: id, name, date_of_birth, role, team_id, team_name

### PUT /api/players/[id]
- **File**: `app/api/players/[id]/route.ts`
- **Query needed**: UPDATE player by ID
- **Return**: Updated player using RETURNING clause

### DELETE /api/players/[id]
- **File**: `app/api/players/[id]/route.ts`
- **Query needed**: DELETE player by ID
- **Note**: Consider cascade delete or foreign key constraints

## Matches API (`/api/matches`)

### GET /api/matches
- **File**: `app/api/matches/route.ts`
- **Query needed**: SELECT matches with team names via JOINs
- **JOINs**: Join teams table 3 times (team1, team2, toss_winner)
- **Columns**: id, team1_id, team2_id, team1_name, team2_name, toss_winner_team_id, toss_winner_team_name, elected_to, match_date, venue
- **Order**: By match_date DESC

### POST /api/matches
- **File**: `app/api/matches/route.ts`
- **Query needed**: INSERT new match
- **Columns**: team1_id, team2_id, toss_winner_team_id, elected_to, match_date, venue
- **Validation**: Ensure team1_id ≠ team2_id, elected_to is 'bat' or 'bowl'
- **Return**: Created match using RETURNING clause

### GET /api/matches/[id]
- **File**: `app/api/matches/[id]/route.ts`
- **Query needed**: SELECT match by ID with team names via JOINs
- **JOINs**: Join teams table 3 times (team1, team2, toss_winner)

### PUT /api/matches/[id]
- **File**: `app/api/matches/[id]/route.ts`
- **Query needed**: UPDATE match by ID
- **Return**: Updated match using RETURNING clause

### DELETE /api/matches/[id]
- **File**: `app/api/matches/[id]/route.ts`
- **Query needed**: DELETE match by ID
- **Note**: Consider cascade delete or foreign key constraints

### GET /api/matches/[id]/playing-xi
- **File**: `app/api/matches/[id]/playing-xi/route.ts`
- **Query needed**: SELECT playing XI for a match
- **JOINs**: Join with players and teams tables
- **Filter**: is_playing_xi = true
- **Columns**: id, match_id, team_id, player_id, is_playing_xi, player_name, team_name
- **Order**: By team_id, then player name

### POST /api/matches/[id]/playing-xi
- **File**: `app/api/matches/[id]/playing-xi/route.ts`
- **Query needed**: INSERT multiple playing XI entries
- **Input**: Array of { team_id, player_id, is_playing_xi }
- **Note**: Use transaction or batch insert
- **Return**: All inserted rows

## Innings API (`/api/innings`)

### GET /api/innings
- **File**: `app/api/innings/route.ts`
- **Query needed**: SELECT innings with team and match information via JOINs
- **Optional filter**: Filter by match_id if provided
- **JOINs**: Join with matches and teams tables (batting_team, bowling_team)
- **Columns**: id, match_id, batting_team_id, bowling_team_id, innings_number, batting_team_name, bowling_team_name, match_date
- **Order**: By match_id, then innings_number

### POST /api/innings
- **File**: `app/api/innings/route.ts`
- **Query needed**: INSERT new innings
- **Columns**: match_id, batting_team_id, bowling_team_id, innings_number
- **Validation**: Ensure batting_team_id ≠ bowling_team_id
- **Return**: Created innings using RETURNING clause

### GET /api/innings/[id]
- **File**: `app/api/innings/[id]/route.ts`
- **Query needed**: SELECT innings by ID with team names via JOINs

### DELETE /api/innings/[id]
- **File**: `app/api/innings/[id]/route.ts`
- **Query needed**: DELETE innings by ID
- **Note**: Consider cascade delete or foreign key constraints

## Overs API (`/api/overs`)

### GET /api/overs
- **File**: `app/api/overs/route.ts`
- **Query needed**: SELECT overs with bowler information via JOINs
- **Optional filter**: Filter by innings_id if provided
- **JOINs**: Join with innings and players tables
- **Columns**: id, innings_id, over_number, bowler_id, bowler_name
- **Order**: By innings_id, then over_number

### POST /api/overs
- **File**: `app/api/overs/route.ts`
- **Query needed**: INSERT new over
- **Columns**: innings_id, over_number, bowler_id
- **Return**: Created over using RETURNING clause

### GET /api/overs/[id]
- **File**: `app/api/overs/[id]/route.ts`
- **Query needed**: SELECT over by ID with bowler information via JOIN

### DELETE /api/overs/[id]
- **File**: `app/api/overs/[id]/route.ts`
- **Query needed**: DELETE over by ID
- **Note**: Consider cascade delete or foreign key constraints

## Balls API (`/api/balls`)

### GET /api/balls
- **File**: `app/api/balls/route.ts`
- **Query needed**: SELECT balls with player information via JOINs
- **Optional filter**: Filter by over_id if provided
- **JOINs**: Join with overs, players (batsman), players (bowler), players (out_player)
- **Columns**: id, over_id, ball_number, batsman_id, bowler_id, runs_off_bat, extra_type, extra_runs, is_legal_delivery, wicket_type, out_player_id, batsman_name, bowler_name, out_player_name
- **Order**: By over_id, then ball_number

### POST /api/balls
- **File**: `app/api/balls/route.ts`
- **Query needed**: INSERT new ball
- **Columns**: over_id, ball_number, batsman_id, bowler_id, runs_off_bat, extra_type, extra_runs, is_legal_delivery, wicket_type, out_player_id
- **Validation**: 
  - extra_type must be one of: 'no_ball', 'wide', 'bye', 'leg_bye' or NULL
  - wicket_type must be one of: 'caught', 'run_out', 'bowled', 'lbw' or NULL
- **Note**: Handle NULL values for optional fields
- **Return**: Created ball using RETURNING clause

### GET /api/balls/[id]
- **File**: `app/api/balls/[id]/route.ts`
- **Query needed**: SELECT ball by ID with player information via JOINs

### PUT /api/balls/[id]
- **File**: `app/api/balls/[id]/route.ts`
- **Query needed**: UPDATE ball by ID
- **Return**: Updated ball using RETURNING clause

### DELETE /api/balls/[id]
- **File**: `app/api/balls/[id]/route.ts`
- **Query needed**: DELETE ball by ID

## Notes

1. All queries use parameterized statements ($1, $2, etc.) to prevent SQL injection
2. Use RETURNING clause for INSERT and UPDATE operations to get the modified row
3. Consider foreign key constraints and cascade delete behavior
4. All date fields should be handled as DATE or TIMESTAMP types
5. Boolean fields (is_playing_xi, is_legal_delivery) should be handled as BOOLEAN type
6. NULL values should be properly handled for optional fields

