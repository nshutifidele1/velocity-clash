import { collection, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Swords, BarChart } from "lucide-react";
import { AdminChart } from "@/components/admin-chart";
import type { MatchResult } from "@/lib/types";

async function getStats() {
    const matchesCol = collection(db, "matches");
    const usersCol = collection(db, "users");

    const matchesSnapshot = await getCountFromServer(matchesCol);
    const usersSnapshot = await getCountFromServer(usersCol);
    
    const matchesDocs = await getDocs(matchesCol);
    const matches = matchesDocs.docs.map(doc => ({...doc.data(), timestamp: doc.data().timestamp.toDate() }) as MatchResult);

    // This is a simplified calculation. A more accurate one would be needed for production.
    const averagePoints = matches.length > 0 
      ? (matches.reduce((acc, match) => acc + match.player1.totalPoints + match.player2.totalPoints, 0) / (matches.length * 2)).toFixed(0)
      : 0;

    return {
        totalMatches: matchesSnapshot.data().count,
        totalUsers: usersSnapshot.data().count,
        matches,
        averagePoints
    };
}


export default async function AdminPage() {
    const { totalMatches, totalUsers, matches, averagePoints } = await getStats();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered players</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                        <Swords className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMatches}</div>
                        <p className="text-xs text-muted-foreground">Completed races</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Points</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averagePoints}</div>
                        <p className="text-xs text-muted-foreground">Across all matches</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminChart data={matches} />
                </CardContent>
            </Card>

        </div>
    );
}
