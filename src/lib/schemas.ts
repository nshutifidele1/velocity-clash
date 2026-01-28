import { z } from "zod";

const playerStatsSchema = z.object({
  name: z.string().min(1, "Player name is required."),
  finishingPosition: z.coerce.number().int().min(1),
  totalPoints: z.coerce.number().int().min(0),
  powerUpHits: z.coerce.number().int().min(0),
  lapTime: z.coerce.number().min(0).optional().or(z.literal('')),
});

export const formSchema = z.object({
  player1: playerStatsSchema,
  player2: playerStatsSchema,
});
