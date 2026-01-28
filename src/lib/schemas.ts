import { z } from "zod";

const playerStatsSchema = z.object({
  name: z.string().min(1, "Player name is required."),
  finishingPosition: z.coerce.number().int().min(1),
  totalPoints: z.coerce.number().int().min(0),
  powerUpHits: z.coerce.number().int().min(0),
  lapTime: z.coerce.number().min(0).optional().or(z.literal('')),
  fansGained: z.coerce.number().int().min(0).optional().or(z.literal('')),
});

export const formSchema = z.object({
  player1: playerStatsSchema,
  player2: playerStatsSchema,
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
