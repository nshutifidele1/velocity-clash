export interface PlayerStats {
  name: string;
  finishingPosition: number;
  totalPoints: number;
  powerUpHits: number;
  lapTime: number;
  fansGained?: number;
}

export interface PlayerResult extends PlayerStats {
  title: string;
}

export interface MatchResult {
  id: string;
  player1: PlayerResult;
  player2: PlayerResult;
  commentary: string;
  timestamp: Date;
  trackName?: string;
}

export interface LeaderboardEntry {
  id: string; // Player name
  totalPoints: number;
  matchesPlayed: number;
  photoUrl?: string;
}

export interface UserProfile {
  uid: string;
  gamingName: string;
  experience: 'Beginner' | 'Intermediate' | 'Pro';
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  photoUrl?: string;
  email: string;
}

export interface PlayerStatsSummary {
  name: string;
  photoUrl?: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPoints: number;
  avgPoints: number;
  totalPowerUpHits: number;
  avgPowerUpHits: number;
  totalFans: number;
}

export interface League {
  id: string;
  name: string;
}

// New types for Tournament Bracket
export interface BracketMatchup {
  id: string;
  round: number;
  match: number;
  players: (UserProfile | { gamingName: 'BYE' } | null)[];
  winner: UserProfile | null;
  nextMatchupId: string | null;
}

export interface BracketRound {
  title: string;
  matchups: BracketMatchup[];
}

export interface UpcomingMatch {
  id: string;
  player1Name: string;
  player2Name: string;
  time: Date;
}

export interface TournamentState {
    size: number;
    selectedPlayers: UserProfile[];
    rounds: BracketRound[];
    champion: UserProfile | null;
    championDisplayName: string;
}
