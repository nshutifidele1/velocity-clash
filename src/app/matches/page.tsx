import { db } from "@/lib/firebase";
import type { MatchResult, UpcomingMatch } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { VersusMatchCard } from "@/components/versus-match-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Swords } from "lucide-react";

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

async function getUpcomingMatches(): Promise<UpcomingMatch[]> {
    try {
      const upcomingMatchesCol = collection(db, "upcomingMatches");
      const q = query(upcomingMatchesCol, orderBy("time", "asc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          time: doc.data().time.toDate(),
      } as UpcomingMatch));
      return list;
    } catch (error) {
        console.error("Error fetching upcoming matches: ", error);
        return [];
    }
  }
  
const UpcomingMatchesSection = async () => {
    const upcoming = await getUpcomingMatches();

    if (upcoming.length === 0) {
        return null;
    }

    return (
        <Card className="w-full bg-card/50 border-primary/40 mb-12">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-glow-primary flex items-center gap-3">
                    <Calendar className="h-7 w-7" />
                    Upcoming Matches
                </CardTitle>
                <CardDescription>
                    Get ready for the next set of clashes!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {upcoming.map((match) => (
                        <div key={match.id} className="text-left p-4 rounded-lg bg-background/50 border flex justify-between items-center">
                            <div>
                                <p className="font-headline text-lg">
                                    {match.player1Name} vs {match.player2Name}
                                </p>
                            </div>
                            <p className="text-muted-foreground text-sm font-mono">{new Date(match.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default async function MatchesPage() {
    const matches = await getMatches();

    return (
        <main className="container mx-auto px-4 py-8">
             <h1 className="font-headline text-4xl mb-12 text-center">Matches</h1>
            
             <UpcomingMatchesSection />

             <div className="flex items-center gap-3 mb-6">
                <Swords className="h-7 w-7 text-accent"/>
                <h2 className="font-headline text-3xl text-accent text-glow-accent">Recent Results</h2>
             </div>
             
             {matches.length > 0 ? (
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    {matches.map(match => (
                        <VersusMatchCard key={match.id} match={match} />
                    ))}
                </div>
             ) : (
                <Card className="text-center text-muted-foreground py-16 bg-card/50">
                    <CardContent className="p-0">
                        <div className="flex flex-col items-center gap-4">
                            <Swords className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-lg">No match results have been recorded yet.</p>
                            <p className="text-sm">Completed matches will appear here once results are submitted.</p>
                        </div>
                    </CardContent>
                </Card>
             )}
        </main>
    )
}
