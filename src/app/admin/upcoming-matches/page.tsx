import { db } from "@/lib/firebase";
import type { UpcomingMatch, UserProfile } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { UpcomingMatchForm } from "@/components/upcoming-match-form";
import { UpcomingMatchActions } from "@/components/upcoming-match-actions";

async function getUpcomingMatches(): Promise<UpcomingMatch[]> {
  try {
    const matchesCol = collection(db, "upcomingMatches");
    const q = query(matchesCol, orderBy("time", "asc"));
    const matchesSnapshot = await getDocs(q);
    const matchesList = matchesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            time: data.time.toDate(),
        } as UpcomingMatch
    });
    return matchesList;
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


export default async function UpcomingMatchesAdminPage() {
    const upcomingMatches = await getUpcomingMatches();
    const players = await getUsers();

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Schedule Upcoming Match
                    </CardTitle>
                    <CardDescription>Add a new match to the upcoming schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UpcomingMatchForm players={players} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Scheduled Matches</CardTitle>
                    <CardDescription>Manage all upcoming matches.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Players</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingMatches.map(match => (
                                <TableRow key={match.id}>
                                    <TableCell>
                                        <div className="font-medium">{match.player1Name}</div>
                                        <div className="text-sm text-muted-foreground">vs {match.player2Name}</div>
                                    </TableCell>
                                    <TableCell>{new Date(match.time).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <UpcomingMatchActions matchId={match.id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {upcomingMatches.length === 0 && <p className="text-center text-muted-foreground py-8">No upcoming matches scheduled.</p>}
                </CardContent>
            </Card>
        </div>
    )
}
