import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MatchResult, PlayerStatsSummary, UserProfile } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from '@/lib/utils';

async function getPlayerStats(): Promise<PlayerStatsSummary[]> {
    const matchesCol = collection(db, "matches");
    const usersCol = collection(db, "users");

    const [matchesSnapshot, usersSnapshot] = await Promise.all([
        getDocs(matchesCol),
        getDocs(usersCol),
    ]);

    const matches = matchesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().timestamp.toDate() }) as MatchResult);
    const users = usersSnapshot.docs.map(doc => doc.data() as UserProfile);

    const stats: { [key: string]: PlayerStatsSummary } = {};

    users.forEach(user => {
        if (user.gamingName) {
            stats[user.gamingName] = {
                name: user.gamingName,
                photoUrl: user.photoUrl,
                gamesPlayed: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                totalPoints: 0,
                avgPoints: 0,
                totalPowerUpHits: 0,
                avgPowerUpHits: 0,
                totalFans: 0,
            };
        }
    });

    matches.forEach(match => {
        const { player1, player2 } = match;

        const p1Stats = stats[player1.name];
        const p2Stats = stats[player2.name];

        if (p1Stats) {
            p1Stats.gamesPlayed += 1;
            p1Stats.totalPoints += player1.totalPoints;
            p1Stats.totalPowerUpHits += player1.powerUpHits;
        }
        if (p2Stats) {
            p2Stats.gamesPlayed += 1;
            p2Stats.totalPoints += player2.totalPoints;
            p2Stats.totalPowerUpHits += player2.powerUpHits;
        }

        if (player1.totalPoints > player2.totalPoints) {
            if (p1Stats) p1Stats.wins += 1;
            if (p2Stats) p2Stats.losses += 1;
        } else if (player2.totalPoints > player1.totalPoints) {
            if (p2Stats) p2Stats.wins += 1;
            if (p1Stats) p1Stats.losses += 1;
        }
    });

    return Object.values(stats).map(playerStat => ({
        ...playerStat,
        winRate: playerStat.gamesPlayed > 0 ? (playerStat.wins / playerStat.gamesPlayed) * 100 : 0,
        avgPoints: playerStat.gamesPlayed > 0 ? playerStat.totalPoints / playerStat.gamesPlayed : 0,
        avgPowerUpHits: playerStat.gamesPlayed > 0 ? playerStat.totalPowerUpHits / playerStat.gamesPlayed : 0,
        totalFans: Math.floor((playerStat.totalPoints / 10) + (playerStat.wins * 50)),
    })).sort((a, b) => b.totalPoints - a.totalPoints);
}


export default async function PlayerStatsPage() {
    const playerStats = await getPlayerStats();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Player Stats</CardTitle>
                <CardDescription>Detailed statistics for all registered players.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead className="text-right">Games</TableHead>
                            <TableHead className="text-right">Wins</TableHead>
                            <TableHead className="text-right">Losses</TableHead>
                            <TableHead className="text-right">Win Rate</TableHead>
                            <TableHead className="text-right">Total Points</TableHead>
                            <TableHead className="text-right">Avg. Points</TableHead>
                            <TableHead className="text-right">Total Hits</TableHead>
                            <TableHead className="text-right">Total Fans</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {playerStats.map(player => (
                            <TableRow key={player.name}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={player.photoUrl} alt={player.name} />
                                            <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{player.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{player.gamesPlayed}</TableCell>
                                <TableCell className="text-right text-accent">{player.wins}</TableCell>
                                <TableCell className="text-right text-destructive">{player.losses}</TableCell>
                                <TableCell className="text-right">{player.winRate.toFixed(0)}%</TableCell>
                                <TableCell className="text-right font-mono font-bold">{player.totalPoints.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-mono">{player.avgPoints.toFixed(0)}</TableCell>
                                <TableCell className="text-right font-mono">{player.totalPowerUpHits.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-mono">{player.totalFans.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {playerStats.length === 0 && <p className="text-center text-muted-foreground py-8">No player data available.</p>}
            </CardContent>
        </Card>
    )
}
