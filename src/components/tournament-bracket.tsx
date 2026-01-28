"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile, BracketRound, BracketMatchup } from '@/lib/types';

const BRACKET_SIZES = [4, 8, 16, 32, 64];

interface TournamentBracketProps {
    initialPlayers: UserProfile[];
}

const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('');
};

const MatchupCard = ({ matchup, onSelectWinner }: { matchup: BracketMatchup, onSelectWinner: (matchupId: string, winner: UserProfile) => void }) => {
    const [player1, player2] = matchup.players;

    const handleWin = (winner: UserProfile) => {
        if (!matchup.winner) {
            onSelectWinner(matchup.id, winner);
        }
    };

    const PlayerDisplay = ({ player }: { player: UserProfile | { gamingName: 'BYE' } | null }) => {
        if (!player) {
            return <div className="flex items-center p-2 h-16 bg-muted/30 rounded-md">...</div>;
        }
        if (player.gamingName === 'BYE') {
            return <div className="flex items-center p-2 h-16 bg-muted/30 rounded-md text-muted-foreground">BYE</div>;
        }

        const isWinner = matchup.winner?.email === (player as UserProfile).email;

        return (
            <div className={cn("flex items-center gap-3 p-2 rounded-md transition-all", isWinner ? "bg-primary/20" : "bg-muted/50")}>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={(player as UserProfile).photoUrl} alt={(player as UserProfile).gamingName} />
                    <AvatarFallback>{getInitials((player as UserProfile).gamingName)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{(player as UserProfile).gamingName}</span>
                {matchup.players.length === 2 && matchup.players.every(p => p) && !matchup.winner && (
                    <Button size="sm" variant="ghost" className="ml-auto" onClick={() => handleWin(player as UserProfile)}>
                        <Crown className="h-4 w-4 text-yellow-400" />
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="relative flex flex-col gap-2 p-3 bg-card rounded-lg border w-64 min-h-[10rem] justify-center">
            <PlayerDisplay player={player1} />
            <div className="h-px bg-border w-full" />
            <PlayerDisplay player={player2} />
        </div>
    );
};


export function TournamentBracket({ initialPlayers }: TournamentBracketProps) {
    const [size, setSize] = useState<number>(8);
    const [selectedPlayers, setSelectedPlayers] = useState<UserProfile[]>([]);
    const [rounds, setRounds] = useState<BracketRound[]>([]);
    const [champion, setChampion] = useState<UserProfile | null>(null);

    const handlePlayerSelection = (player: UserProfile, isSelected: boolean) => {
        if (isSelected) {
            if (selectedPlayers.length < size) {
                setSelectedPlayers([...selectedPlayers, player]);
            }
        } else {
            setSelectedPlayers(selectedPlayers.filter(p => p.email !== player.email));
        }
    };
    
    const generateBracket = () => {
        const numRounds = Math.log2(size);
        const newRounds: BracketRound[] = [];
        let shuffledPlayers = [...selectedPlayers].sort(() => Math.random() - 0.5);

        // Pad with BYEs if not enough players
        while (shuffledPlayers.length < size) {
            shuffledPlayers.push({ gamingName: 'BYE' } as any);
        }

        let currentRoundPlayers: (UserProfile | { gamingName: 'BYE' } | null)[] = shuffledPlayers;

        for (let i = 0; i < numRounds; i++) {
            const roundMatchups: BracketMatchup[] = [];
            const isFinalRound = i === numRounds - 1;
            
            for (let j = 0; j < size / Math.pow(2, i + 1); j++) {
                const p1 = currentRoundPlayers[j*2] || null;
                const p2 = currentRoundPlayers[j*2 + 1] || null;
                
                const nextMatchNumber = Math.floor(j / 2);
                const nextMatchupId = isFinalRound ? null : `r${i+1}m${nextMatchNumber}`;

                const matchup: BracketMatchup = {
                    id: `r${i}m${j}`,
                    round: i,
                    match: j,
                    players: i === 0 ? [p1, p2] : [null, null],
                    winner: null,
                    nextMatchupId: nextMatchupId
                };

                // Auto-advance BYEs
                if (i === 0) {
                    if(p1 && p2?.gamingName === 'BYE') matchup.winner = p1 as UserProfile;
                    if(p2 && p1?.gamingName === 'BYE') matchup.winner = p2 as UserProfile;
                }

                roundMatchups.push(matchup);
            }
            newRounds.push({ title: `Round ${i + 1}`, matchups: roundMatchups });
        }
        
        // Auto-propagate BYE winners
        for (let round of newRounds) {
            for (let matchup of round.matchups) {
                if (matchup.winner && matchup.nextMatchupId) {
                     const [nextRoundIndex, nextMatchIndex] = matchup.nextMatchupId.match(/r(\d+)m(\d+)/)!.slice(1).map(Number);
                     const nextMatch = newRounds[nextRoundIndex]?.matchups[nextMatchIndex];
                     if (nextMatch) {
                         const slot = matchup.match % 2 === 0 ? 0 : 1;
                         nextMatch.players[slot] = matchup.winner;
                     }
                }
            }
        }


        setRounds(newRounds);
        setChampion(null);
    };

    const handleSetWinner = (matchupId: string, winner: UserProfile) => {
        let newRoundsData = JSON.parse(JSON.stringify(rounds));
        let matchWon: BracketMatchup | null = null;

        for (const round of newRoundsData) {
            const matchup = round.matchups.find(m => m.id === matchupId);
            if (matchup) {
                matchup.winner = winner;
                matchWon = matchup;
                break;
            }
        }
        
        if (matchWon && matchWon.nextMatchupId) {
            const [nextRoundIndex, nextMatchIndex] = matchWon.nextMatchupId.match(/r(\d+)m(\d+)/)!.slice(1).map(Number);
            const nextMatch = newRoundsData[nextRoundIndex]?.matchups[nextMatchIndex];
            if (nextMatch) {
                const slot = matchWon.match % 2 === 0 ? 0 : 1;
                nextMatch.players[slot] = winner;
            }
        } else if (matchWon) {
            // This was the final match
            setChampion(winner);
        }

        setRounds(newRoundsData);
    };

    const roundTitles: {[key: number]: string} = {
        64: "Round of 64",
        32: "Round of 32",
        16: "Round of 16",
        8: "Quarterfinals",
        4: "Semifinals",
        2: "Finals"
    }

    if (rounds.length === 0) {
        return (
            <div className="space-y-6 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Bracket Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Bracket Size</Label>
                                <Select value={String(size)} onValueChange={(val) => setSize(Number(val))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BRACKET_SIZES.map(s => <SelectItem key={s} value={String(s)}>{s} Players</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Select Players ({selectedPlayers.length}/{size})</Label>
                            <ScrollArea className="h-64 rounded-md border">
                                <div className="p-4 space-y-2">
                                    {initialPlayers.map(player => (
                                        <div key={player.email} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={player.email}
                                                checked={selectedPlayers.some(p => p.email === player.email)}
                                                onCheckedChange={(checked) => handlePlayerSelection(player, !!checked)}
                                                disabled={selectedPlayers.length >= size && !selectedPlayers.some(p => p.email === player.email)}
                                            />
                                            <Label htmlFor={player.email} className="font-normal">{player.gamingName}</Label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={generateBracket} disabled={selectedPlayers.length < 2}>
                            Generate Bracket
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold font-headline">{size}-Player Tournament</h2>
                 <Button variant="outline" onClick={() => setRounds([])}>Reset Bracket</Button>
            </div>

            {champion && (
                 <Card className="max-w-md mx-auto text-center border-2 border-primary box-glow-primary">
                    <CardHeader>
                        <Trophy className="h-16 w-16 mx-auto text-primary text-glow-primary" />
                        <CardTitle className="text-3xl font-headline text-primary text-glow-primary">CHAMPION</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary">
                            <AvatarImage src={champion.photoUrl} alt={champion.gamingName} />
                            <AvatarFallback>{getInitials(champion.gamingName)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold">{champion.gamingName}</h3>
                    </CardContent>
                </Card>
            )}

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-12 p-4 items-center">
                    {rounds.map((round, roundIndex) => (
                        <div key={roundIndex} className="flex flex-col items-center gap-8">
                            <h3 className="font-headline text-xl text-accent text-glow-accent">{roundTitles[round.matchups.length * 2] || `Round ${roundIndex + 1}`}</h3>
                            <div className="flex flex-col" style={{gap: `${Math.pow(2, roundIndex) * 3.5}rem`}}>
                                {round.matchups.map((matchup) => (
                                    <div key={matchup.id} className="relative">
                                        <MatchupCard matchup={matchup} onSelectWinner={handleSetWinner} />
                                        {/* Connector Lines */}
                                        {roundIndex < rounds.length -1 && (
                                            <>
                                            <div className="absolute top-1/2 -right-6 h-px w-6 bg-border"></div>
                                            {matchup.match % 2 === 0 ?
                                                <div className="absolute top-1/2 -right-6 h-[calc(50%+2.7rem)] w-px bg-border"></div> :
                                                <div className="absolute bottom-1/2 -right-6 h-[calc(50%+2.7rem)] w-px bg-border"></div>
                                            }
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}