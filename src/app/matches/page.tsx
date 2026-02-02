import { db } from "@/lib/firebase";
import type { MatchResult } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { VersusMatchCard } from "@/components/versus-match-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Swords } from "lucide-react";

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
            
             {matches.length > 0 ? (
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    {matches.map(match => (
                        <VersusMatchCard key={match.id} match={match} />
                    ))}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center text-center py-16">
                    <Card className="max-w-md w-full bg-card/50 border-primary/40 p-8 rounded-2xl shadow-2xl shadow-primary/20 box-glow-primary transition-all hover:shadow-primary/30">
                        <CardHeader className="p-0 items-center">
                            <div className="w-20 h-20 mb-6 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary animate-pulse">
                                <Swords className="w-10 h-10 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-4xl text-primary text-glow-primary">
                                No Matches Yet
                            </CardTitle>
                            <CardDescription className="text-lg mt-2">
                                Be the first to start a rivalry!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-8">
                            <Button asChild size="lg" className="font-headline text-lg">
                                <Link href="/add-result">
                                    Start a Match
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
             )}
        </main>
    )
}
