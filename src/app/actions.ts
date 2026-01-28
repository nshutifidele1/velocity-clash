"use server";

import { z } from "zod";
import { assignPerformanceTitles } from "@/ai/flows/assign-performance-titles";
import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { redirect } from "next/navigation";
import { formSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function submitMatchResults(values: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(values);

    const aiInput = {
      player1Name: validatedData.player1.name,
      player1FinishingPosition: validatedData.player1.finishingPosition,
      player1TotalPoints: validatedData.player1.totalPoints,
      player1PowerUpHits: validatedData.player1.powerUpHits,
      player1LapTime: Number(validatedData.player1.lapTime) || undefined,
      player2Name: validatedData.player2.name,
      player2FinishingPosition: validatedData.player2.finishingPosition,
      player2TotalPoints: validatedData.player2.totalPoints,
      player2PowerUpHits: validatedData.player2.powerUpHits,
      player2LapTime: Number(validatedData.player2.lapTime) || undefined,
    };

    const aiResult = await assignPerformanceTitles(aiInput);
    
    const matchRef = doc(collection(db, "matches"));

    const matchData = {
      player1: {
        ...validatedData.player1,
        lapTime: Number(validatedData.player1.lapTime) || 0,
        title: aiResult.player1Title,
      },
      player2: {
        ...validatedData.player2,
        lapTime: Number(validatedData.player2.lapTime) || 0,
        title: aiResult.player2Title,
      },
      commentary: aiResult.commentary,
      timestamp: serverTimestamp(),
    };

    await runTransaction(db, async (transaction) => {
      const player1Ref = doc(db, "leaderboard", validatedData.player1.name.toLowerCase());
      const player1Doc = await transaction.get(player1Ref);
      if (!player1Doc.exists()) {
        transaction.set(player1Ref, { totalPoints: validatedData.player1.totalPoints, matchesPlayed: 1, id: validatedData.player1.name });
      } else {
        const newPoints = player1Doc.data().totalPoints + validatedData.player1.totalPoints;
        const newMatches = player1Doc.data().matchesPlayed + 1;
        transaction.update(player1Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
      }

      const player2Ref = doc(db, "leaderboard", validatedData.player2.name.toLowerCase());
      const player2Doc = await transaction.get(player2Ref);
      if (!player2Doc.exists()) {
        transaction.set(player2Ref, { totalPoints: validatedData.player2.totalPoints, matchesPlayed: 1, id: validatedData.player2.name });
      } else {
        const newPoints = player2Doc.data().totalPoints + validatedData.player2.totalPoints;
        const newMatches = player2Doc.data().matchesPlayed + 1;
        transaction.update(player2Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
      }

      transaction.set(matchRef, matchData);
    });

    redirect(`/results?id=${matchRef.id}`);

  } catch (error) {
    console.error("Error submitting match results:", error);
    if (error instanceof z.ZodError) {
        return { error: "Validation failed", details: error.flatten() };
    }
    return { error: "An unexpected error occurred on the server." };
  }
}

export async function autoGenerateMatch() {
    try {
        const leaderboardCol = collection(db, "leaderboard");
        const leaderboardSnapshot = await getDocs(leaderboardCol);
        const players = leaderboardSnapshot.docs.map(doc => doc.data().id as string);

        if (players.length < 2) {
            return { error: "Not enough players to generate a match. At least 2 players are required." };
        }

        // Select two different random players
        let player1Index = Math.floor(Math.random() * players.length);
        let player2Index = Math.floor(Math.random() * players.length);
        while (player1Index === player2Index) {
            player2Index = Math.floor(Math.random() * players.length);
        }

        const player1Name = players[player1Index];
        const player2Name = players[player2Index];

        // Generate random stats
        const player1Points = Math.floor(Math.random() * 4501) + 500;
        const player2Points = Math.floor(Math.random() * 4501) + 500;

        const values = {
            player1: {
                name: player1Name,
                finishingPosition: player1Points > player2Points ? 1 : 2,
                totalPoints: player1Points,
                powerUpHits: Math.floor(Math.random() * 21),
                lapTime: (Math.random() * 60 + 60).toFixed(2),
            },
            player2: {
                name: player2Name,
                finishingPosition: player2Points > player1Points ? 1 : 2,
                totalPoints: player2Points,
                powerUpHits: Math.floor(Math.random() * 21),
                lapTime: (Math.random() * 60 + 60).toFixed(2),
            },
        };

        const validatedData = formSchema.parse(values);
        
        const aiInput = {
          player1Name: validatedData.player1.name,
          player1FinishingPosition: validatedData.player1.finishingPosition,
          player1TotalPoints: validatedData.player1.totalPoints,
          player1PowerUpHits: validatedData.player1.powerUpHits,
          player1LapTime: Number(validatedData.player1.lapTime) || undefined,
          player2Name: validatedData.player2.name,
          player2FinishingPosition: validatedData.player2.finishingPosition,
          player2TotalPoints: validatedData.player2.totalPoints,
          player2PowerUpHits: validatedData.player2.powerUpHits,
          player2LapTime: Number(validatedData.player2.lapTime) || undefined,
        };

        const aiResult = await assignPerformanceTitles(aiInput);
        
        const matchRef = doc(collection(db, "matches"));

        const matchData = {
          player1: {
            ...validatedData.player1,
            lapTime: Number(validatedData.player1.lapTime) || 0,
            title: aiResult.player1Title,
          },
          player2: {
            ...validatedData.player2,
            lapTime: Number(validatedData.player2.lapTime) || 0,
            title: aiResult.player2Title,
          },
          commentary: aiResult.commentary,
          timestamp: serverTimestamp(),
        };

        await runTransaction(db, async (transaction) => {
          const player1Ref = doc(db, "leaderboard", validatedData.player1.name.toLowerCase());
          const player1Doc = await transaction.get(player1Ref);
          if (!player1Doc.exists()) {
            transaction.set(player1Ref, { totalPoints: validatedData.player1.totalPoints, matchesPlayed: 1, id: validatedData.player1.name });
          } else {
            const newPoints = player1Doc.data().totalPoints + validatedData.player1.totalPoints;
            const newMatches = player1Doc.data().matchesPlayed + 1;
            transaction.update(player1Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
          }

          const player2Ref = doc(db, "leaderboard", validatedData.player2.name.toLowerCase());
          const player2Doc = await transaction.get(player2Ref);
          if (!player2Doc.exists()) {
            transaction.set(player2Ref, { totalPoints: validatedData.player2.totalPoints, matchesPlayed: 1, id: validatedData.player2.name });
          } else {
            const newPoints = player2Doc.data().totalPoints + validatedData.player2.totalPoints;
            const newMatches = player2Doc.data().matchesPlayed + 1;
            transaction.update(player2Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
          }

          transaction.set(matchRef, matchData);
        });
        
        revalidatePath("/admin/matches");
        revalidatePath("/matches");
        revalidatePath("/leaderboard-page");

        return { success: true };

    } catch (error) {
        console.error("Error auto-generating match:", error);
         if (error instanceof z.ZodError) {
            return { error: "Validation failed during generation", details: error.flatten() };
        }
        return { error: "An unexpected error occurred while generating the match." };
    }
}
