import { db } from "@/lib/firebase";
import type { LeaderboardEntry, UserProfile } from "@/lib/types";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { Crown, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  try {
    const leaderboardCol = collection(db, "leaderboard");
    const usersCol = collection(db, "users");

    const [leaderboardSnapshot, usersSnapshot] = await Promise.all([
        getDocs(query(leaderboardCol, orderBy("totalPoints", "desc"), limit(10))),
        getDocs(usersCol)
    ]);
    
    const leaderboardList = leaderboardSnapshot.docs.map(doc => doc.data() as LeaderboardEntry);

    const usersMap = new Map<string, UserProfile>();
    usersSnapshot.docs.forEach(doc => {
        const user = doc.data() as UserProfile;
        if (user.gamingName) {
            usersMap.set(user.gamingName, user);
        }
    });

    const combinedLeaderboard = leaderboardList.map(entry => {
        const userProfile = usersMap.get(entry.id);
        return {
            ...entry,
            photoUrl: userProfile?.photoUrl,
        };
    });

    return combinedLeaderboard;

  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    return [];
  }
}

export async function Leaderboard() {
  const leaderboard = await getLeaderboardData();
  const topPlayer = leaderboard.length > 0 ? leaderboard[0] : null;
  const otherPlayers = leaderboard.length > 1 ? leaderboard.slice(1) : [];


  return (
    <Card className="w-full bg-card/50 border-primary/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary text-glow-primary">
          <Trophy />
          Weekly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
            {topPlayer ? (
                <div className="bg-primary/20 border-2 border-primary box-glow-primary p-6 rounded-xl max-w-md mx-auto text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={topPlayer.photoUrl} alt={topPlayer.id} />
                        <AvatarFallback>{getInitials(topPlayer.id)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center justify-center gap-2">
                        <h3 className="font-headline text-3xl font-semibold">{topPlayer.id}</h3>
                        <Crown className="h-8 w-8 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px #facc15)'}} />
                    </div>
                    <p className="text-sm text-muted-foreground">{topPlayer.matchesPlayed} matches played</p>
                    <div className="font-mono text-4xl font-bold text-accent text-glow-accent mt-4">
                        {topPlayer.totalPoints.toLocaleString()} PTS
                    </div>
                </div>
            ) : (
                <div className="text-muted-foreground text-center py-12 bg-background/50 rounded-lg">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                    <h3 className="text-xl font-headline mb-2">The Throne is Empty</h3>
                    <p>No matches played yet. Be the first to claim the top spot!</p>
                </div>
            )}
        </div>
        
        {otherPlayers.length > 0 && (
            <div>
                <h3 className="text-xl font-headline text-accent text-glow-accent mb-4 text-center">Top Contenders</h3>
                <ol className="space-y-4">
                    {otherPlayers.map((player, index) => (
                    <li
                        key={player.id}
                        className="flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out bg-background/50 hover:bg-muted/50 hover:scale-[1.02]"
                    >
                        <div className="flex items-center gap-4">
                        <span className="font-bold text-lg w-8 text-center text-muted-foreground">
                            {index + 2}
                        </span>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={player.photoUrl} alt={player.id} />
                            <AvatarFallback>{getInitials(player.id)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-headline text-lg font-semibold">{player.id}</span>
                            <p className="text-sm text-muted-foreground">{player.matchesPlayed} matches played</p>
                        </div>
                        </div>
                        <div className="font-mono text-xl font-bold text-accent text-glow-accent">
                        {player.totalPoints.toLocaleString()} PTS
                        </div>
                    </li>
                    ))}
                </ol>
            </div>
        )}
      </CardContent>
    </Card>
  );
}