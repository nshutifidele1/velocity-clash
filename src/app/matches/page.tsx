import { db } from "@/lib/firebase";
import type { MatchResult } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matches.map(match => (
                    <Card key={match.id} className="bg-card/50 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:border-primary/50">
                        <CardHeader>
                            <CardTitle>{match.player1.name} vs {match.player2.name}</CardTitle>
                            <CardDescription>
                                {new Date(match.timestamp).toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>{match.player1.name}: {match.player1.totalPoints} PTS</p>
                                    <p>{match.player2.name}: {match.player2.totalPoints} PTS</p>
                                </div>
                                <Button asChild variant="outline">
                                    <Link href={`/results?id=${match.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
             {matches.length === 0 && <p className="text-center text-muted-foreground">No matches found.</p>}
        </main>
    )
}
