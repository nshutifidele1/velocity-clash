import { loadTournamentBracket } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface TournamentChampionCardProps {
    storageKey: string;
    title: string;
}

export async function TournamentChampionCard({ storageKey, title }: TournamentChampionCardProps) {
    const { data: tournament } = await loadTournamentBracket(storageKey);

    if (!tournament || !tournament.champion) {
        return null;
    }

    const { champion, championDisplayName } = tournament;

    return (
        <Card className="w-full bg-card/50 border-primary/40 mb-12 animate-fade-in-up">
            <CardHeader className="text-center items-center">
                <Crown className="h-10 w-10 text-yellow-400 mb-2" style={{filter: 'drop-shadow(0 0 10px #facc15)'}} />
                <CardTitle className="font-headline text-3xl text-primary text-glow-primary">
                    {title} Tournament Champion
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24 border-4 border-primary box-glow-primary">
                        <AvatarImage src={champion.photoUrl} alt={championDisplayName || champion.gamingName} />
                        <AvatarFallback>{getInitials(championDisplayName || champion.gamingName)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-headline text-4xl font-bold">{championDisplayName || champion.gamingName}</h3>
                </div>
            </CardContent>
        </Card>
    );
}
