import { db } from "@/lib/firebase";
import type { MatchResult, UpcomingMatch, UserProfile } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { VersusMatchCard } from "@/components/versus-match-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Swords } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

async function getUsers(): Promise<UserProfile[]> {
    try {
      const usersCol = collection(db, "users");
      const usersSnapshot = await getDocs(usersCol);
      const usersList = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              gamingName: data.gamingName,
              experience: data.experience,
              gender: data.gender,
              photoUrl: data.photoUrl,
              email: data.email,
          } as UserProfile;
      });
      return usersList.filter(u => u.gamingName);
    } catch (error) {
      console.error("Error fetching users: ", error);
      return [];
    }
}
  
const UpcomingMatchesSection = async ({ upcoming, users }: { upcoming: UpcomingMatch[], users: UserProfile[] }) => {
    const usersMap = new Map<string, UserProfile>();
    users.forEach(user => {
        if (user.gamingName) {
            usersMap.set(user.gamingName, user);
        }
    });

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
                <div className="space-y-6">
                    {upcoming.map((match) => {
                        const player1 = usersMap.get(match.player1Name);
                        const player2 = usersMap.get(match.player2Name);

                        return (
                             <div key={match.id} className="text-center p-6 rounded-xl bg-background/50 border-2 border-border/50 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                                <div className="flex justify-around items-center">
                                    <div className="flex flex-col items-center gap-2 w-1/3">
                                        <Avatar className="h-16 w-16 border-2 border-muted">
                                            <AvatarImage src={player1?.photoUrl} alt={player1?.gamingName} />
                                            <AvatarFallback>{getInitials(match.player1Name)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-headline text-lg font-semibold truncate w-full">{match.player1Name}</p>
                                    </div>
                                    <Swords className="h-10 w-10 text-primary" />
                                    <div className="flex flex-col items-center gap-2 w-1/3">
                                        <Avatar className="h-16 w-16 border-2 border-muted">
                                            <AvatarImage src={player2?.photoUrl} alt={player2?.gamingName} />
                                            <AvatarFallback>{getInitials(match.player2Name)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-headline text-lg font-semibold truncate w-full">{match.player2Name}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-md font-mono mt-4">{new Date(match.time).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default async function MatchesPage() {
    const [matches, upcoming, users] = await Promise.all([
        getMatches(),
        getUpcomingMatches(),
        getUsers(),
    ]);

    return (
        <main className="container mx-auto px-4 py-8">
             <h1 className="font-headline text-4xl mb-12 text-center">Matches</h1>
            
             <UpcomingMatchesSection upcoming={upcoming} users={users} />

             <div className="flex items-center gap-3 mb-6 mt-12">
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
