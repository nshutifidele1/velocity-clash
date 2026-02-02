import { db } from "@/lib/firebase";
import type { MatchResult } from "@/lib/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from 'next/link';
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export default async function AdminMatchesPage() {
    const matches = await getMatches();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle>Matches</CardTitle>
                        <CardDescription>Manage all submitted match results.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/admin/matches/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Match
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Players</TableHead>
                            <TableHead>Winner</TableHead>
                            <TableHead>Commentary</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map(match => (
                            <TableRow key={match.id}>
                                <TableCell>
                                    <div className="font-medium">{match.player1.name}</div>
                                    <div className="text-sm text-muted-foreground">vs {match.player2.name}</div>
                                </TableCell>
                                <TableCell>{match.player1.finishingPosition === 1 ? match.player1.name : match.player2.name}</TableCell>
                                <TableCell className="max-w-xs truncate">{match.commentary}</TableCell>
                                <TableCell className="hidden md:table-cell">{new Date(match.timestamp).toLocaleDateString()}</TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild><Link href={`/results?id=${match.id}`}>View</Link></DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
