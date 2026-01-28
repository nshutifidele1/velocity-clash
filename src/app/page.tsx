import { MatchForm } from "@/components/match-form";
import { Leaderboard } from "@/components/leaderboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Velocity Clash
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The ultimate Blur-inspired split-screen racing competition.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <h2 className="font-headline text-3xl mb-6 text-center lg:text-left">Enter Match Stats</h2>
          <MatchForm />
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-headline text-3xl mb-6 text-center lg:text-left">Leaderboard</h2>
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
