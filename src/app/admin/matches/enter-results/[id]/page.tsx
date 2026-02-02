import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UpcomingMatch } from "@/lib/types";
import { EnterResultsForm } from "@/components/enter-results-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

async function getUpcomingMatch(id: string): Promise<UpcomingMatch | null> {
    try {
        const matchRef = doc(db, "upcomingMatches", id);
        const matchSnap = await getDoc(matchRef);

        if (!matchSnap.exists()) {
            return null;
        }
        
        const data = matchSnap.data();
        return {
            id: matchSnap.id,
            ...data,
            time: data.time.toDate(),
        } as UpcomingMatch;
    } catch (error) {
        console.error("Error fetching upcoming match:", error);
        return null;
    }
}

export default async function EnterResultsPage({ params }: { params: { id: string }}) {
    const upcomingMatch = await getUpcomingMatch(params.id);

    if (!upcomingMatch) {
        return (
            <div className="flex items-center justify-center h-full">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Upcoming match not found. It might have been deleted or already played.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Enter Match Results</CardTitle>
                <CardDescription>Enter the stats for the match between {upcomingMatch.player1Name} and {upcomingMatch.player2Name}.</CardDescription>
            </CardHeader>
            <CardContent>
                <EnterResultsForm upcomingMatch={upcomingMatch} />
            </CardContent>
        </Card>
    );
}
