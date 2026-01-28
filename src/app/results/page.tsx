"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { MatchResult, PlayerResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PerformanceBadge } from "@/components/performance-badge";
import { ArrowLeft, BarChart, Medal, TrendingUp, Zap } from "lucide-react";

function ResultsDisplay() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  if (!data) {
    return (
      <div className="text-center">
        <p className="text-destructive text-lg">No match data found.</p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    );
  }

  const results: MatchResult = JSON.parse(data);

  const PlayerCard = ({ player }: { player: PlayerResult }) => (
    <Card className="w-full h-full flex flex-col bg-card/50 border-primary/20 backdrop-blur-sm text-center">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary text-glow-primary">{player.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between space-y-6">
        <div className="grid grid-cols-2 gap-4 text-lg">
            <div className="flex flex-col items-center gap-1 p-2 bg-background/50 rounded-md">
                <Medal className="w-6 h-6 text-muted-foreground"/>
                <span className="font-bold">{player.finishingPosition}</span>
                <span className="text-sm text-muted-foreground">Position</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-background/50 rounded-md">
                <BarChart className="w-6 h-6 text-muted-foreground"/>
                <span className="font-bold">{player.totalPoints.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">Points</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-background/50 rounded-md">
                <TrendingUp className="w-6 h-6 text-muted-foreground"/>
                <span className="font-bold">{player.powerUpHits}</span>
                <span className="text-sm text-muted-foreground">Hits</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-background/50 rounded-md">
                <Zap className="w-6 h-6 text-muted-foreground"/>
                <span className="font-bold">{player.lapTime > 0 ? `${player.lapTime}s` : 'N/A'}</span>
                <span className="text-sm text-muted-foreground">Lap Time</span>
            </div>
        </div>
        <PerformanceBadge title={player.title} />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <PlayerCard player={results.player1} />
        <PlayerCard player={results.player2} />
      </div>
      <Card className="bg-card/50 border-accent/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-accent text-glow-accent">AI Commentary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic text-center">"{results.commentary}"</p>
        </CardContent>
      </Card>
      <div className="text-center">
        <Button asChild size="lg" className="font-headline text-lg bg-accent text-accent-foreground hover:bg-accent/90 rounded-md box-glow-accent transition-all">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" /> Play Again
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col justify-center">
       <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary text-glow-primary">
          Match Results
        </h1>
      </div>
      <Suspense fallback={<div className="text-center">Loading results...</div>}>
        <ResultsDisplay />
      </Suspense>
    </main>
  );
}
