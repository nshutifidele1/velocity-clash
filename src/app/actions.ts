"use server";

import { z } from "zod";
import { assignPerformanceTitles } from "@/ai/flows/assign-performance-titles";
import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp, collection, addDoc, setDoc, deleteDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { formSchema, upcomingMatchSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function submitMatchResults(values: z.infer<typeof formSchema>, upcomingMatchId?: string) {
  try {
    const validatedData = formSchema.parse(values);

    const p1LapTimeNum = validatedData.player1.lapTime;
    const p2LapTimeNum = validatedData.player2.lapTime;

    const p1FansGainedNum = validatedData.player1.fansGained || 0;
    const p2FansGainedNum = validatedData.player2.fansGained || 0;


    const aiInput = {
      player1Name: validatedData.player1.name,
      player1FinishingPosition: validatedData.player1.finishingPosition,
      player1TotalPoints: validatedData.player1.totalPoints,
      player1PowerUpHits: validatedData.player1.powerUpHits,
      player1LapTime: p1LapTimeNum,
      player1SpeedRank: p1LapTimeNum ? undefined : Math.floor(Math.random() * 10) + 1,
      player2Name: validatedData.player2.name,
      player2FinishingPosition: validatedData.player2.finishingPosition,
      player2TotalPoints: validatedData.player2.totalPoints,
      player2PowerUpHits: validatedData.player2.powerUpHits,
      player2LapTime: p2LapTimeNum,
      player2SpeedRank: p2LapTimeNum ? undefined : Math.floor(Math.random() * 10) + 1,
    };

    const aiResult = await assignPerformanceTitles(aiInput);
    
    const matchRef = doc(collection(db, "matches"));

    const tracks = ["City Park", "Mountain Pass", "Coastal Highway", "Desert Run", "Neon Alley"];
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

    const matchData = {
      player1: {
        name: validatedData.player1.name,
        finishingPosition: validatedData.player1.finishingPosition,
        totalPoints: validatedData.player1.totalPoints,
        powerUpHits: validatedData.player1.powerUpHits,
        lapTime: p1LapTimeNum ?? 0,
        fansGained: p1FansGainedNum,
        title: aiResult.player1Title,
      },
      player2: {
        name: validatedData.player2.name,
        finishingPosition: validatedData.player2.finishingPosition,
        totalPoints: validatedData.player2.totalPoints,
        powerUpHits: validatedData.player2.powerUpHits,
        lapTime: p2LapTimeNum ?? 0,
        fansGained: p2FansGainedNum,
        title: aiResult.player2Title,
      },
      commentary: aiResult.commentary,
      trackName: randomTrack,
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
      
      if (upcomingMatchId) {
        const upcomingMatchRef = doc(db, "upcomingMatches", upcomingMatchId);
        transaction.delete(upcomingMatchRef);
      }
    });

    revalidatePath("/admin/matches");
    revalidatePath("/matches");
    revalidatePath("/leaderboard-page");
    
    if (upcomingMatchId) {
        revalidatePath("/admin/upcoming-matches");
    }

    redirect(`/results?id=${matchRef.id}`);

  } catch (error) {
    console.error("Error submitting match results:", error);
    if (error instanceof z.ZodError) {
        return { error: "Validation failed", details: error.flatten() };
    }
    if (error instanceof Error) {
        if (error.message.includes('Please pass in the API key') || error.message.includes('API key not valid')) {
            return { error: 'AI service authentication failed. Please ensure your GEMINI_API_KEY is configured correctly in the .env file.' };
        }
        return { error: error.message };
    }
    return { error: "An unexpected error occurred on the server." };
  }
}

export async function addUpcomingMatch(values: z.infer<typeof upcomingMatchSchema>) {
  try {
    const validatedData = upcomingMatchSchema.parse(values);

    await addDoc(collection(db, "upcomingMatches"), {
      player1Name: validatedData.player1Name,
      player2Name: validatedData.player2Name,
      time: validatedData.time,
    });

    revalidatePath("/matches");
    revalidatePath("/admin/upcoming-matches");

    return { success: "Upcoming match added!" };

  } catch (error) {
    console.error("Error adding upcoming match:", error);
    if (error instanceof z.ZodError) {
        return { error: "Validation failed", details: error.flatten() };
    }
    return { error: "An unexpected error occurred on the server." };
  }
}

export async function deleteUpcomingMatch(id: string) {
  try {
    if (!id) {
        return { error: "Match ID is required." };
    }
    await deleteDoc(doc(db, "upcomingMatches", id));
    
    revalidatePath("/matches");
    revalidatePath("/admin/upcoming-matches");
    
    return { success: "Upcoming match deleted!" };
  } catch (error) {
    console.error("Error deleting upcoming match:", error);
    return { error: "An unexpected error occurred on the server." };
  }
}
