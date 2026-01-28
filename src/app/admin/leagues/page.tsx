import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shapes } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateLeagueForm } from "@/components/create-league-form";
import type { League } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

async function getLeagues(): Promise<League[]> {
    try {
        const leaguesCol = collection(db, "leagues");
        const q = query(leaguesCol, orderBy("name"));
        const leaguesSnapshot = await getDocs(q);
        const leaguesList = leaguesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
            } as League;
        });
        return leaguesList;
    } catch (error) {
        console.error("Error fetching leagues: ", error);
        return [];
    }
}


export default async function AdminLeaguesPage() {
    const leagues = await getLeagues();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shapes className="h-6 w-6" />
                            Leagues & Categories
                        </CardTitle>
                        <CardDescription>Manage racing leagues and event categories.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create New League
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create a New League</DialogTitle>
                                <DialogDescription>
                                    Enter a name for your new league. This will help you categorize matches.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateLeagueForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {leagues.length > 0 ? (
                    <ul className="space-y-2">
                        {leagues.map(league => (
                            <li key={league.id} className="flex items-center justify-between rounded-md border p-4">
                                <span className="font-medium">{league.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <Shapes className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">No Leagues Found</h3>
                        <p>Get started by creating your first racing league.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}