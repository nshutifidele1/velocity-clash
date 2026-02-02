import { z } from "zod";

const playerStatsSchema = z.object({
  name: z.string().min(1, "Player name is required."),
  finishingPosition: z.coerce.number().int().min(1, "Position must be 1 or greater."),
  totalPoints: z.coerce.number().int().min(0, "Points cannot be negative."),
  powerUpHits: z.coerce.number().int().min(0, "Hits cannot be negative."),
  lapTime: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.number({ invalid_type_error: "Lap time must be a number" }).optional()
  ),
  fansGained: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.number({ invalid_type_error: "Fans gained must be a number" }).optional()
  ),
});

export const formSchema = z.object({
  player1: playerStatsSchema,
  player2: playerStatsSchema,
}).refine(data => {
    if (!data.player1.name || !data.player2.name) return true;
    return data.player1.name !== data.player2.name;
}, {
    message: "Players cannot be the same person.",
    path: ["player2", "name"],
});

export const registerSchema = z.object({
    gamingName: z.string().min(3, { message: "Gaming name must be at least 3 characters." }),
    experience: z.enum(["Beginner", "Intermediate", "Pro"], { required_error: "Please select your experience level." }),
    photoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], { required_error: "Please select your gender." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Password is required." }),
});

export const upcomingMatchSchema = z.object({
  player1Name: z.string().min(1, "Player 1 name is required."),
  player2Name: z.string().min(1, "Player 2 name is required."),
  time: z.date({ required_error: "Match time is required." }),
}).refine(data => data.player1Name !== data.player2Name, {
    message: "Players cannot be the same.",
    path: ["player2Name"],
});
