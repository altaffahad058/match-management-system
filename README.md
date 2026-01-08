# Cricket Management System

A comprehensive cricket management system built with Next.js and PostgreSQL, featuring real-time match scoring, team management, and detailed statistics tracking.

## 🏏 Features

### Team & Player Management
- **Teams**: Create and manage cricket teams with country codes
- **Players**: Manage player profiles with roles (Batsman, Bowler, All-rounder, etc.)
- **Team Assignment**: Assign players to teams with role-based organization

### Match Management
- **Match Creation**: Set up matches between teams with toss details
- **Overs Configuration**: Configure number of overs per innings (1-50 overs)
- **Playing XI Selection**: Interactive selection of 11 players per team
- **Match Details**: Track venue, date, toss winner, and elected choice

### Live Match Scoring
- **Ball-by-Ball Entry**: Record every ball with detailed information
  - Runs off bat (0-6)
  - Extras (No Ball, Wide, Bye, Leg Bye) with runs
  - Wicket types (Caught, Run Out, Bowled, LBW)
  - Legal/Illegal delivery tracking
- **Live Score Display**: Real-time scorecard showing:
  - Current score and wickets
  - Overs bowled (e.g., 12.3)
  - Run rate calculation
- **Over Visualization**: Visual representation of balls in current over
- **Automatic Over Progression**: Moves to next over after 6 legal deliveries

### Statistics & Tracking
- **Innings Management**: Track multiple innings per match
- **Over-by-Over Analysis**: View detailed breakdown of each over
- **Player Performance**: Track individual player contributions
- **Match History**: Complete record of all matches

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router)
- **Database**: PostgreSQL (raw SQL queries, no ORM)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Database Driver**: `pg` (node-postgres)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd match-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/cricket_db
   ```
   
   Example:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/cricket_management
   ```

4. **Set up the database**
   
   Create your PostgreSQL database and run your schema creation scripts. The project expects the following tables:
   - `teams`
   - `players`
   - `matches`
   - `playing_xi`
   - `innings`
   - `overs`
   - `balls`

5. **Implement SQL queries**
   
   All API routes have TODO comments indicating what SQL queries need to be written. See `QUERY_TODOS.md` for a complete list of required queries.

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
match-management-system/
├── app/
│   ├── api/                    # API routes
│   │   ├── teams/              # Team management endpoints
│   │   ├── players/             # Player management endpoints
│   │   ├── matches/             # Match management endpoints
│   │   ├── innings/             # Innings endpoints
│   │   ├── overs/               # Over endpoints
│   │   └── balls/               # Ball-by-ball endpoints
│   ├── components/             # React components
│   │   ├── Navigation.tsx       # Main navigation
│   │   ├── LiveScore.tsx        # Live score display
│   │   ├── MatchScorecard.tsx   # Ball entry interface
│   │   ├── PlayingXISelector.tsx # Playing XI selection
│   │   └── OverDisplay.tsx      # Over visualization
│   ├── matches/                # Match pages
│   │   ├── page.tsx             # Matches list
│   │   └── [id]/
│   │       ├── page.tsx         # Match details
│   │       └── score/
│   │           └── page.tsx    # Match scoring interface
│   ├── teams/                   # Team management pages
│   ├── players/                  # Player management pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                 # Home page
├── lib/
│   └── db/
│       ├── connection.ts        # Database connection pool
│       └── init.ts              # Database initialization
├── public/                      # Static assets
├── QUERY_TODOS.md              # SQL query requirements
└── README.md                    # This file
```

## 🎯 Usage Guide

### 1. Create Teams
1. Navigate to **Teams** from the home page
2. Click **"+ Add Team"**
3. Enter team name and country code (e.g., "IND", "AUS")
4. Save the team

### 2. Add Players
1. Navigate to **Players**
2. Click **"+ Add Player"**
3. Fill in player details:
   - Name
   - Date of Birth
   - Role (Batsman, Bowler, All-rounder, etc.)
   - Team assignment
4. Save the player

### 3. Create a Match
1. Navigate to **Matches**
2. Click **"+ New Match"**
3. Select Team 1 and Team 2
4. Choose toss winner and elected choice (Bat/Bowl)
5. Enter match date and venue
6. Save the match

### 4. Score a Match
1. From the matches list, click **"Score"** on a match
2. **Step 1 - Setup**: Configure number of overs per innings
3. **Step 2 - Playing XI**: Select 11 players for each team
4. **Step 3 - Scoring**: 
   - Select batsman and bowler
   - Enter runs off bat
   - Add extras if any (No Ball, Wide, etc.)
   - Record wickets if applicable
   - Click **"Record Ball"** to save
   - System automatically progresses to next over after 6 legal balls

## 📝 SQL Queries

This project uses **raw SQL queries** without an ORM. All API routes contain TODO comments describing what queries need to be implemented.

### Key Points:
- All queries use parameterized statements (`$1`, `$2`, etc.) to prevent SQL injection
- Use `RETURNING` clause for INSERT and UPDATE operations
- Handle NULL values properly for optional fields
- Consider foreign key constraints and cascade delete behavior

See `QUERY_TODOS.md` for a complete list of required queries with detailed descriptions.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Connection

The database connection is initialized automatically when the app starts. The connection pool is managed in `lib/db/connection.ts` and provides helper functions:

- `query()` - Execute a query and return all rows
- `queryOne()` - Execute a query and return a single row
- `getPool()` - Get the database connection pool

## 🎨 UI Features

- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Dark Mode**: Full dark mode support
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live score updates as you record balls
- **Visual Feedback**: Color-coded balls (runs, wickets, extras)
- **Interactive Selection**: Easy playing XI selection with visual indicators

## 📊 Database Schema

The system uses the following main tables:

- **Teams**: id, name, country_code
- **Players**: id, name, date_of_birth, role, team_id
- **Matches**: id, team1_id, team2_id, toss_winner_team_id, elected_to, match_date, venue
- **Playing_XI**: id, match_id, team_id, player_id, is_playing_xi
- **Innings**: id, match_id, batting_team_id, bowling_team_id, innings_number
- **Overs**: id, innings_id, over_number, bowler_id
- **Balls**: id, over_id, ball_number, batsman_id, bowler_id, runs_off_bat, extra_type, extra_runs, is_legal_delivery, wicket_type, out_player_id

## 🤝 Contributing

1. Implement the SQL queries as described in TODO comments
2. Test all functionality thoroughly
3. Ensure proper error handling
4. Follow TypeScript best practices

## 📄 License

This project is open source and available for personal and educational use.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set in `.env.local`
- Ensure PostgreSQL is running
- Check database credentials and permissions

### Module Not Found Errors
- Run `npm install` to install all dependencies
- Ensure Node.js version is 18 or higher

### Query Errors
- Check that all required tables exist in the database
- Verify foreign key relationships are properly set up
- Review SQL query syntax in your implementations

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Note**: This project is designed for learning and practicing raw SQL queries. All database operations use parameterized queries for security, and the structure encourages understanding of SQL fundamentals.
