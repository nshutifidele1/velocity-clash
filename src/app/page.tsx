import { Leaderboard } from "@/components/leaderboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import type { MatchResult } from "@/lib/types";
import { MatchCard } from "@/components/match-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getLatestMatch(): Promise<MatchResult | null> {
    try {
        const matchesCol = collection(db, "matches");
        const q = query(matchesCol, orderBy("timestamp", "desc"), limit(1));
        const matchesSnapshot = await getDocs(q);
        if (matchesSnapshot.empty) {
            return null;
        }
        const matchDoc = matchesSnapshot.docs[0];
        const data = matchDoc.data();
        return {
            id: matchDoc.id,
            ...data,
            timestamp: data.timestamp.toDate(),
        } as MatchResult;
    } catch (error) {
        console.error("Error fetching latest match:", error);
        return null;
    }
}


export default async function Home() {
    const latestMatch = await getLatestMatch();

  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Blur Racing Results
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Speed. Power. Chaos.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <h2 className="font-headline text-3xl mb-6 text-center lg:text-left">Latest Match</h2>
            {latestMatch ? (
                <MatchCard match={latestMatch} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full bg-card/50 p-8 rounded-lg text-center">
                    <p className="text-muted-foreground text-lg mb-4">No matches have been played yet.</p>
                    <Button asChild>
                        <Link href="/add-result">Be the first to add a result! <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-headline text-3xl mb-6 text-center lg:text-left">Weekly Leaderboard</h2>
           <Suspense fallback={<LeaderboardSkeleton />}>
             <Leaderboard />
           </Suspense>
        </div>
      </div>
    </main>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 flex-1" />
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  )
}
