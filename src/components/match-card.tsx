import type { MatchResult, PlayerResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceBadge } from "@/components/performance-badge";
import { BarChart, Medal, TrendingUp, Zap } from "lucide-react";

const PlayerCard = ({ player }: { player: PlayerResult }) => (
    <Card className="w-full h-full flex flex-col bg-card/50 border-primary/20 backdrop-blur-sm text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-primary/80">
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

export function MatchCard({ match }: { match: MatchResult }) {
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <PlayerCard player={match.player1} />
                <PlayerCard player={match.player2} />
            </div>
             <Card className="bg-card/50 border-accent/50 backdrop-blur-sm">
                <CardHeader>
                <CardTitle className="font-headline text-accent text-glow-accent">AI Commentary</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-lg italic text-center">"{match.commentary}"</p>
                </CardContent>
            </Card>
        </div>
    )
}
