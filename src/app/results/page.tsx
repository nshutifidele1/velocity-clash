import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { Suspense } from "react";
import type { MatchResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/match-card";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


async function getMatch(id: string): Promise<MatchResult | null> {
    if (!id) return null;
    try {
        const matchRef = doc(db, "matches", id);
        const matchSnap = await getDoc(matchRef);

        if (!matchSnap.exists()) {
            return null;
        }
        
        const data = matchSnap.data();
        const matchResult: MatchResult = {
            id: matchSnap.id,
            player1: data.player1,
            player2: data.player2,
            commentary: data.commentary,
            timestamp: data.timestamp.toDate(),
        };

        return matchResult;
    } catch (error) {
        console.error("Error fetching match:", error);
        return null;
    }
}

async function ResultsDisplay({ id }: { id: string }) {
  const results = await getMatch(id);

  if (!results) {
    return (
      <div className="text-center">
        <p className="text-destructive text-lg">No match data found, or an error occurred.</p>
        <Button asChild className="mt-4">
          <Link href="/matches">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Matches
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <MatchCard match={results} />
      <div className="text-center">
        <Button asChild size="lg" className="font-headline text-lg bg-accent text-accent-foreground hover:bg-accent/90 rounded-md box-glow-accent transition-all">
          <Link href="/matches">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Matches
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage({ searchParams }: { searchParams: { id: string }}) {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col justify-center">
       <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Match Results
        </h1>
      </div>
      <Suspense fallback={<MatchCardSkeleton />}>
        <ResultsDisplay id={searchParams.id} />
      </Suspense>
    </main>
  );
}

function MatchCardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
            </div>
            <Skeleton className="h-[100px] w-full" />
        </div>
    )
}
