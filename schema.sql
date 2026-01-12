-- Cricket Management System Database Schema
-- Run this script in your PostgreSQL database to create all tables

-- Teams table
CREATE TABLE IF NOT EXISTS Teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(3) NOT NULL
);

-- Players table
CREATE TABLE IF NOT EXISTS Players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    role VARCHAR(50) NOT NULL,
    team_id INTEGER NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Teams(id) ON DELETE CASCADE
);

-- Matches table
CREATE TABLE IF NOT EXISTS Matches (
    id SERIAL PRIMARY KEY,
    team1_id INTEGER NOT NULL,
    team2_id INTEGER NOT NULL,
    toss_winner_team_id INTEGER NOT NULL,
    elected_to VARCHAR(4) NOT NULL CHECK (elected_to IN ('bat', 'bowl')),
    match_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
    total_overs INTEGER DEFAULT 20,
    FOREIGN KEY (team1_id) REFERENCES Teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team2_id) REFERENCES Teams(id) ON DELETE CASCADE,
    FOREIGN KEY (toss_winner_team_id) REFERENCES Teams(id) ON DELETE CASCADE
);

-- Playing_XI table
CREATE TABLE IF NOT EXISTS Playing_XI (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    is_playing_xi BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY (match_id) REFERENCES Matches(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Players(id) ON DELETE CASCADE
);

-- Innings table
CREATE TABLE IF NOT EXISTS Innings (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL,
    batting_team_id INTEGER NOT NULL,
    bowling_team_id INTEGER NOT NULL,
    innings_number INTEGER NOT NULL,
    FOREIGN KEY (match_id) REFERENCES Matches(id) ON DELETE CASCADE,
    FOREIGN KEY (batting_team_id) REFERENCES Teams(id) ON DELETE CASCADE,
    FOREIGN KEY (bowling_team_id) REFERENCES Teams(id) ON DELETE CASCADE
);

-- Overs table
CREATE TABLE IF NOT EXISTS Overs (
    id SERIAL PRIMARY KEY,
    innings_id INTEGER NOT NULL,
    over_number INTEGER NOT NULL,
    bowler_id INTEGER NOT NULL,
    FOREIGN KEY (innings_id) REFERENCES Innings(id) ON DELETE CASCADE,
    FOREIGN KEY (bowler_id) REFERENCES Players(id) ON DELETE CASCADE
);

-- Balls table
CREATE TABLE IF NOT EXISTS Balls (
    id SERIAL PRIMARY KEY,
    over_id INTEGER NOT NULL,
    ball_number INTEGER NOT NULL,
    batsman_id INTEGER NOT NULL,
    bowler_id INTEGER NOT NULL,
    runs_off_bat INTEGER NOT NULL DEFAULT 0,
    extra_type VARCHAR(20) CHECK (extra_type IN ('no_ball', 'wide', 'bye', 'leg_bye')),
    extra_runs INTEGER DEFAULT 0,
    is_legal_delivery BOOLEAN NOT NULL DEFAULT true,
    wicket_type VARCHAR(20) CHECK (wicket_type IN ('caught', 'run_out', 'bowled', 'lbw')),
    out_player_id INTEGER,
    FOREIGN KEY (over_id) REFERENCES Overs(id) ON DELETE CASCADE,
    FOREIGN KEY (batsman_id) REFERENCES Players(id) ON DELETE CASCADE,
    FOREIGN KEY (bowler_id) REFERENCES Players(id) ON DELETE CASCADE,
    FOREIGN KEY (out_player_id) REFERENCES Players(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_team_id ON Players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_team1_id ON Matches(team1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team2_id ON Matches(team2_id);
CREATE INDEX IF NOT EXISTS idx_playing_xi_match_id ON Playing_XI(match_id);
CREATE INDEX IF NOT EXISTS idx_innings_match_id ON Innings(match_id);
CREATE INDEX IF NOT EXISTS idx_overs_innings_id ON Overs(innings_id);
CREATE INDEX IF NOT EXISTS idx_balls_over_id ON Balls(over_id);

