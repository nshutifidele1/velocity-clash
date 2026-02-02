import { z } from 'zod';

// Schema for assignPerformanceTitles flow
export const AssignPerformanceTitlesInputSchema = z.object({
  player1Name: z.string().describe('Name of player 1'),
  player1FinishingPosition: z.number().describe('Finishing position of player 1'),
  player1TotalPoints: z.number().describe('Total points of player 1'),
  player1PowerUpHits: z.number().describe('Number of power-up hits by player 1'),
  player1LapTime: z.number().optional().describe('Best lap time of player 1'),
  player1SpeedRank: z.number().optional().describe('Speed rank of player 1 if lap time is unavailable'),
  player2Name: z.string().describe('Name of player 2'),
  player2FinishingPosition: z.number().describe('Finishing position of player 2'),
  player2TotalPoints: z.number().describe('Total points of player 2'),
  player2PowerUpHits: z.number().describe('Number of power-up hits by player 2'),
  player2LapTime: z.number().optional().describe('Best lap time of player 2'),
  player2SpeedRank: z.number().optional().describe('Speed rank of player 2 if lap time is unavailable'),
});
export type AssignPerformanceTitlesInput = z.infer<typeof AssignPerformanceTitlesInputSchema>;

export const AssignPerformanceTitlesOutputSchema = z.object({
  player1Title: z.string().describe('Performance title for player 1'),
  player2Title: z.string().describe('Performance title for player 2'),
  commentary: z.string().describe('Short, entertaining commentary on the match'),
});
export type AssignPerformanceTitlesOutput = z.infer<typeof AssignPerformanceTitlesOutputSchema>;


// Schema for summarizePlayerPerformance flow
export const SummarizePlayerPerformanceInputSchema = z.object({
    playerName: z.string().describe("Player's name"),
    finishingPosition: z.number().describe("Player's finishing position"),
    totalPoints: z.number().describe("Player's total points in the match"),
    powerUpHits: z.number().describe("Number of power-ups hit by the player"),
    lapTime: z.number().optional().describe("Player's best lap time"),
    speedRank: z.number().optional().describe("Player's speed rank if lap time is unavailable"),
});
export type SummarizePlayerPerformanceInput = z.infer<typeof SummarizePlayerPerformanceInputSchema>;

export const SummarizePlayerPerformanceOutputSchema = z.object({
    comment: z.string().describe("A short, one-sentence comment praising the player's performance."),
});
export type SummarizePlayerPerformanceOutput = z.infer<typeof SummarizePlayerPerformanceOutputSchema>;
