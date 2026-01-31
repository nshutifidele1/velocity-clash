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

  return (
    <Card className="w-full bg-card/50 border-primary/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary text-glow-primary">
          <Trophy />
          Weekly Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
          <ol className="space-y-4">
            {leaderboard.map((player, index) => (
              <li
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ease-in-out ${
                  index === 0
                    ? "bg-primary/20 border border-primary box-glow-primary"
                    : "bg-background/50 hover:bg-muted/50 hover:scale-[1.02]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-bold text-lg w-8 text-center ${
                      index === 0 ? "text-primary text-glow-primary" : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={player.photoUrl} alt={player.id} />
                    <AvatarFallback>{getInitials(player.id)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-lg font-semibold">{player.id}</span>
                      {index === 0 && (
                        <Crown className="h-5 w-5 text-yellow-400" style={{filter: 'drop-shadow(0 0 3px #facc15)'}} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{player.matchesPlayed} matches played</p>
                  </div>
                </div>
                <div className="font-mono text-xl font-bold text-accent text-glow-accent">
                  {player.totalPoints.toLocaleString()} PTS
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground text-center py-8">No matches played yet. Be the first to set a record!</p>
        )}
      </CardContent>
    </Card>
  );
}
