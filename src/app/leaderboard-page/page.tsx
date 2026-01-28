import { Leaderboard } from "@/components/leaderboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl mb-8 text-center">Leaderboard</h1>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <div className="max-w-4xl mx-auto">
          <Leaderboard />
        </div>
      </Suspense>
    </main>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg max-w-4xl mx-auto">
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
