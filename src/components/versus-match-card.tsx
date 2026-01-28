import type { MatchResult } from "@/lib/types";
import { Clock, Route } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function VersusMatchCard({ match }: { match: MatchResult }) {
  return (
    <Card className="relative overflow-hidden border-border bg-card/80 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
      <div className="flex flex-col md:flex-row items-stretch min-h-[250px]">
        {/* Player 1 Panel */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white relative"
          style={{
            borderRight: '2px solid hsl(var(--border))',
            background: 'radial-gradient(circle at center left, hsl(var(--destructive) / 0.4), transparent 80%)',
          }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 z-10" style={{ textShadow: '0 0 10px hsl(var(--destructive)), 0 0 20px hsl(var(--destructive))' }}>{match.player1.name}</h2>
          <p className="font-mono text-5xl md:text-6xl font-bold z-10">{match.player1.totalPoints}</p>
          <p className="text-sm text-white/80 z-10">Points</p>
        </div>

        {/* VS Separator */}
        <div className="flex items-center justify-center p-4 bg-transparent z-20 md:w-auto w-full my-4 md:my-0">
          <span className="font-headline text-4xl md:text-6xl font-black text-primary text-glow-primary">VS</span>
        </div>

        {/* Player 2 Panel */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white relative"
           style={{
            borderLeft: '2px solid hsl(var(--border))',
            background: 'radial-gradient(circle at center right, hsl(var(--primary) / 0.4), transparent 80%)',
          }}
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 z-10" style={{ textShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary))' }}>{match.player2.name}</h2>
          <p className="font-mono text-5xl md:text-6xl font-bold z-10">{match.player2.totalPoints}</p>
          <p className="text-sm text-white/80 z-10">Points</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-border/50 bg-background/50 p-3 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Route className="h-4 w-4" />
                <span>{match.trackName || "Unknown Track"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{new Date(match.timestamp).toLocaleDateString()}</span>
            </div>
        </div>
        <Button asChild variant="outline" size="sm">
            <Link href={`/results?id=${match.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
