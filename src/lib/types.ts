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
}

export interface UserProfile {
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
