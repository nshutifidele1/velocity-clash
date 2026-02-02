
"use server";

import "dotenv/config";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, runTransaction, serverTimestamp, collection, addDoc, setDoc, deleteDoc, getDoc, query, where, getDocs } from "firebase/firestore";
import { redirect } from "next/navigation";
import { formSchema, upcomingMatchSchema, playerStatsOnlySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import type { TournamentState, UserProfile, BracketMatchup } from "@/lib/types";

export async function submitMatchResults(
    values: z.infer<typeof formSchema>, 
    upcomingMatchId?: string,
    tournamentInfo?: { storageKey: string, matchupId: string }
) {
  let matchRefId: string;
  try {
    const validatedData = formSchema.parse(values);

    const p1FinishingPosition = validatedData.winner === 'player1' ? 1 : 2;
    const p2FinishingPosition = validatedData.winner === 'player2' ? 1 : 2;

    const p1LapTimeNum = validatedData.player1.lapTime;
    const p2LapTimeNum = validatedData.player2.lapTime;

    const p1FansGainedNum = validatedData.player1.fansGained || 0;
    const p2FansGainedNum = validatedData.player2.fansGained || 0;


    // AI call is replaced with deterministic logic to ensure stability.
    let p1Title = '';
    let p2Title = '';
    
    if (validatedData.winner === 'player1') {
        p1Title = 'Match Winner';
    } else {
        p2Title = 'Match Winner';
    }

    if (validatedData.player1.powerUpHits > validatedData.player2.powerUpHits) {
        if (!p1Title) p1Title = 'Most Shooter';
    } else if (validatedData.player2.powerUpHits > validatedData.player1.powerUpHits) {
        if (!p2Title) p2Title = 'Most Shooter';
    }

    if (p1LapTimeNum && p2LapTimeNum) {
        if (p1LapTimeNum < p2LapTimeNum) {
            if (!p1Title) p1Title = 'Fastest Driver';
        } else if (p2LapTimeNum < p1LapTimeNum) {
            if (!p2Title) p2Title = 'Fastest Driver';
        }
    }

    // Fallback titles
    if (!p1Title) p1Title = "Valiant Rival";
    if (!p2Title) p2Title = "Valiant Rival";

    const winnerName = validatedData.winner === 'player1' ? validatedData.player1.name : validatedData.player2.name;
    const commentary = `A hard-fought battle! ${winnerName} clinched the victory after an intense race.`;

    const result = {
      player1Title: p1Title,
      player2Title: p2Title,
      commentary: commentary,
    };
    
    const matchRef = doc(collection(db, "matches"));
    matchRefId = matchRef.id;

    const tracks = ["City Park", "Mountain Pass", "Coastal Highway", "Desert Run", "Neon Alley"];
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

    const matchData = {
      player1: {
        name: validatedData.player1.name,
        finishingPosition: p1FinishingPosition,
        totalPoints: validatedData.player1.totalPoints,
        powerUpHits: validatedData.player1.powerUpHits,
        lapTime: p1LapTimeNum ?? 0,
        fansGained: p1FansGainedNum,
        title: result.player1Title,
      },
      player2: {
        name: validatedData.player2.name,
        finishingPosition: p2FinishingPosition,
        totalPoints: validatedData.player2.totalPoints,
        powerUpHits: validatedData.player2.powerUpHits,
        lapTime: p2LapTimeNum ?? 0,
        fansGained: p2FansGainedNum,
        title: result.player2Title,
      },
      commentary: result.commentary,
      trackName: randomTrack,
      timestamp: serverTimestamp(),
    };

    await runTransaction(db, async (transaction) => {
      // --- READ PHASE ---
      const player1Ref = doc(db, "leaderboard", validatedData.player1.name.toLowerCase());
      const player2Ref = doc(db, "leaderboard", validatedData.player2.name.toLowerCase());
      
      const player1Doc = await transaction.get(player1Ref);
      const player2Doc = await transaction.get(player2Ref);

      // --- WRITE PHASE ---
      if (!player1Doc.exists()) {
        transaction.set(player1Ref, { totalPoints: validatedData.player1.totalPoints, matchesPlayed: 1, id: validatedData.player1.name });
      } else {
        const newPoints = player1Doc.data().totalPoints + validatedData.player1.totalPoints;
        const newMatches = player1Doc.data().matchesPlayed + 1;
        transaction.update(player1Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
      }

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

    if (tournamentInfo) {
      const bracketData = await loadTournamentBracket(tournamentInfo.storageKey);
      if (bracketData.data) {
          const bracket = bracketData.data;

          const winnerNameVal = validatedData.winner === 'player1' ? validatedData.player1.name : validatedData.player2.name;
          
          const usersQuery = query(collection(db, "users"), where("gamingName", "==", winnerNameVal));
          const usersSnapshot = await getDocs(usersQuery);

          if (!usersSnapshot.empty) {
              const winnerProfile = usersSnapshot.docs[0].data() as UserProfile;

              let matchWon: BracketMatchup | null = null;
              for (const round of bracket.rounds) {
                  const matchup = round.matchups.find(m => m.id === tournamentInfo.matchupId);
                  if (matchup) {
                      matchup.winner = winnerProfile;
                      matchWon = matchup;
                      break;
                  }
              }

              if (matchWon && matchWon.nextMatchupId) {
                  const [nextRoundIndex, nextMatchIndex] = matchWon.nextMatchupId.match(/r(\d+)m(\d+)/)!.slice(1).map(Number);
                  const nextMatch = bracket.rounds[nextRoundIndex]?.matchups[nextMatchIndex];
                  if (nextMatch) {
                      const slot = matchWon.match % 2 === 0 ? 0 : 1;
                      nextMatch.players[slot] = winnerProfile;
                  }
              } else if (matchWon) {
                  // Final match
                  bracket.champion = winnerProfile;
                  bracket.championDisplayName = winnerProfile.gamingName;
              }
              
              await saveTournamentBracket(tournamentInfo.storageKey, bracket);
          }
      }
    }

    revalidatePath("/admin/matches");
    revalidatePath("/matches");
    revalidatePath("/leaderboard-page");
    
    if (upcomingMatchId) {
        revalidatePath("/admin/upcoming-matches");
    }
    if (tournamentInfo) {
      revalidatePath('/admin/leagues');
      revalidatePath('/admin');
    }

  } catch (error) {
    console.error("Error submitting match results:", error);
    if (error instanceof z.ZodError) {
        return { error: "Validation failed", details: error.flatten() };
    }
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unexpected error occurred on the server." };
  }

  if (tournamentInfo) {
    redirect('/admin/leagues');
  } else {
    redirect(`/results?id=${matchRefId}`);
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

export async function saveTournamentBracket(storageKey: string, state: TournamentState) {
    try {
        if (!storageKey) {
            return { error: "Storage key is required." };
        }
        const bracketRef = doc(db, "tournaments", storageKey);
        await setDoc(bracketRef, state);
        return { success: "Bracket saved successfully." };
    } catch (error) {
        console.error("Error saving tournament bracket:", error);
        return { error: "An unexpected error occurred while saving the bracket." };
    }
}

export async function loadTournamentBracket(storageKey: string): Promise<{ data?: TournamentState; error?: string }> {
    try {
        if (!storageKey) {
            return { error: "Storage key is required." };
        }
        const bracketRef = doc(db, "tournaments", storageKey);
        const bracketSnap = await getDoc(bracketRef);

        if (bracketSnap.exists()) {
            const data = bracketSnap.data();
            // Simple validation, a more robust solution would use Zod
            const validatedData: TournamentState = {
                size: data.size || 8,
                selectedPlayers: data.selectedPlayers || [],
                rounds: data.rounds || [],
                champion: data.champion || null,
                championDisplayName: data.championDisplayName || ''
            };
            return { data: validatedData };
        }
        return { data: undefined };

    } catch (error) {
        console.error("Error loading tournament bracket:", error);
        return { error: "An unexpected error occurred while loading the bracket." };
    }
}

export async function deleteTournamentBracket(storageKey: string) {
    try {
        if (!storageKey) {
            return { error: "Storage key is required." };
        }
        await deleteDoc(doc(db, "tournaments", storageKey));
        revalidatePath("/admin/leagues");
        revalidatePath("/admin");
        return { success: "Bracket reset successfully." };
    } catch (error) {
        console.error("Error deleting tournament bracket:", error);
        return { error: "An unexpected error occurred while resetting the bracket." };
    }
}


export async function deleteMatch(id: string) {
  try {
    if (!id) {
        return { error: "Match ID is required." };
    }
    
    const matchRef = doc(db, "matches", id);
    
    await runTransaction(db, async (transaction) => {
        // --- READ PHASE ---
        const matchDoc = await transaction.get(matchRef);
        if (!matchDoc.exists()) {
            throw new Error("Match not found.");
        }
        const matchData = matchDoc.data();
        
        const p1Data = matchData.player1;
        const p2Data = matchData.player2;

        let player1Ref, player1Doc, player2Ref, player2Doc;

        if (p1Data && p1Data.name) {
            player1Ref = doc(db, "leaderboard", p1Data.name.toLowerCase());
            player1Doc = await transaction.get(player1Ref);
        }

        if (p2Data && p2Data.name) {
            player2Ref = doc(db, "leaderboard", p2Data.name.toLowerCase());
            player2Doc = await transaction.get(player2Ref);
        }

        // --- WRITE PHASE ---
        if (p1Data && p1Data.name && player1Ref && player1Doc?.exists()) {
            const newPoints = player1Doc.data().totalPoints - p1Data.totalPoints;
            const newMatches = Math.max(0, player1Doc.data().matchesPlayed - 1);
            transaction.update(player1Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
        }
        
        if (p2Data && p2Data.name && player2Ref && player2Doc?.exists()) {
            const newPoints = player2Doc.data().totalPoints - p2Data.totalPoints;
            const newMatches = Math.max(0, player2Doc.data().matchesPlayed - 1);
            transaction.update(player2Ref, { totalPoints: newPoints, matchesPlayed: newMatches });
        }
        
        transaction.delete(matchRef);
    });

    revalidatePath("/admin/matches");
    revalidatePath("/matches");
    revalidatePath("/leaderboard-page");
    revalidatePath("/admin/player-stats");

    return { success: "Match deleted successfully!" };

  } catch (error) {
    console.error("Error deleting match:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unexpected error occurred on the server." };
  }
}
