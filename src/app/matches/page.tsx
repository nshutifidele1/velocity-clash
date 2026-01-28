import { db } from "@/lib/firebase";
import type { MatchResult } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { VersusMatchCard } from "@/components/versus-match-card";

async function getMatches(): Promise<MatchResult[]> {
  try {
    const matchesCol = collection(db, "matches");
    const q = query(matchesCol, orderBy("timestamp", "desc"));
    const matchesSnapshot = await getDocs(q);
    const matchesList = matchesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate(),
        } as MatchResult
    });
    return matchesList;
  } catch (error) {
    console.error("Error fetching matches: ", error);
    return [];
  }
}

export default async function MatchesPage() {
    const matches = await getMatches();

    return (
        <main className="container mx-auto px-4 py-8">
             <h1 className="font-headline text-4xl mb-8 text-center">All Matches</h1>
             <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                {matches.map(match => (
                    <VersusMatchCard key={match.id} match={match} />
                ))}
             </div>
             {matches.length === 0 && <p className="text-center text-muted-foreground">No matches found.</p>}
        </main>
    )
}
