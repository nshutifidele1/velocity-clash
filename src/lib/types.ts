export interface PlayerStats {
  name: string;
  finishingPosition: number;
  totalPoints: number;
  powerUpHits: number;
  lapTime: number;
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
}

export interface LeaderboardEntry {
  id: string; // Player name
  totalPoints: number;
  matchesPlayed: number;
}
