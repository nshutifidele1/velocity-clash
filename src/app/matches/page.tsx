import { db } from "@/lib/firebase";
import type { MatchResult, UserProfile } from "@/lib/types";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { VersusMatchCard } from "@/components/versus-match-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Swords } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

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

async function getPotentialMatchup(): Promise<UserProfile[]> {
    try {
      const usersCol = collection(db, "users");
      const q = query(usersCol, limit(2));
      const usersSnapshot = await getDocs(q);
      if (usersSnapshot.empty) {
          return [];
      }
      const usersList = usersSnapshot.docs.map(doc => doc.data() as UserProfile);
      return usersList;
    } catch (error) {
      console.error("Error fetching users for matchup: ", error);
      return [];
    }
}

export default async function MatchesPage() {
    const matches = await getMatches();
    const potentialPlayers = matches.length === 0 ? await getPotentialMatchup() : [];

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
                    <Card className="max-w-2xl w-full bg-card/50 border-primary/40 p-8 rounded-2xl shadow-2xl shadow-primary/20 box-glow-primary transition-all hover:shadow-primary/30">
                        <CardHeader className="p-0 items-center">
                            <CardTitle className="font-headline text-4xl text-primary text-glow-primary mb-4">
                                Who Will Clash Next?
                            </CardTitle>
                             {potentialPlayers.length >= 2 ? (
                                <div className="flex items-center justify-center gap-8 md:gap-16 my-6">
                                    <div className="flex flex-col items-center gap-3">
                                        <Avatar className="h-24 w-24 border-4 border-destructive/50">
                                            <AvatarImage src={potentialPlayers[0].photoUrl} alt={potentialPlayers[0].gamingName} />
                                            <AvatarFallback>{getInitials(potentialPlayers[0].gamingName)}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-headline text-2xl">{potentialPlayers[0].gamingName}</h3>
                                    </div>
                                    <Swords className="w-12 h-12 text-primary shrink-0" />
                                     <div className="flex flex-col items-center gap-3">
                                        <Avatar className="h-24 w-24 border-4 border-accent/50">
                                            <AvatarImage src={potentialPlayers[1].photoUrl} alt={potentialPlayers[1].gamingName} />
                                            <AvatarFallback>{getInitials(potentialPlayers[1].gamingName)}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-headline text-2xl">{potentialPlayers[1].gamingName}</h3>
                                    </div>
                                </div>
                             ) : (
                                <div className="w-20 h-20 mb-6 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary animate-pulse">
                                    <Swords className="w-10 h-10 text-primary" />
                                </div>
                             )}
                            <CardDescription className="text-lg mt-2 max-w-sm">
                                No matches have been played yet. Be the first to start the action and set the rivalry!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 mt-8">
                            <Button asChild size="lg" className="font-headline text-lg w-full max-w-xs mx-auto">
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
