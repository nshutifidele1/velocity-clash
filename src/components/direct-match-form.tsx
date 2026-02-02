"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitMatchResults } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { formSchema } from "@/lib/schemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { UserProfile } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface DirectMatchFormProps {
    players: UserProfile[];
    p1name?: string;
    p2name?: string;
    tournamentParams?: {
        storageKey: string;
        matchupId: string;
    };
}

export function DirectMatchForm({ players, p1name, p2name, tournamentParams }: DirectMatchFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player1: {
        name: p1name || "",
        totalPoints: 0,
        powerUpHits: 0,
        lapTime: '',
        fansGained: '',
      },
      player2: {
        name: p2name || "",
        totalPoints: 0,
        powerUpHits: 0,
        lapTime: '',
        fansGained: '',
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await submitMatchResults(values, undefined, tournamentParams);
      if (result?.error) {
        let description = result.error;
        if (result.details) {
            // This is a simple way to show Zod errors. A real app might format this better.
            description = Object.values(result.details.fieldErrors).flat().join(", ");
        }
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: description,
        });
      }
      // Redirect is handled by the server action
    });
  }

  const player1Name = form.watch("player1.name");
  const player2Name = form.watch("player2.name");
  const arePlayersPreselected = !!(p1name && p2name);

  const renderPlayerFields = (player: "player1" | "player2", title: string) => (
    <Card className="w-full bg-transparent border-secondary">
      <CardHeader>
        <CardTitle className="font-headline text-accent text-glow-accent">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`${player}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""} disabled={arePlayersPreselected}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a player" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {players.map((p) => (
                        <SelectItem key={p.email} value={p.gamingName}>
                            {p.gamingName}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name={`${player}.totalPoints`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${player}.powerUpHits`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power-up Hits</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${player}.lapTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lap Time (sec)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
          control={form.control}
          name={`${player}.fansGained`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fans Gained</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Optional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {renderPlayerFields("player1", "Player 1")}
          {renderPlayerFields("player2", "Player 2")}
        </div>
        
        <FormField
          control={form.control}
          name="winner"
          render={({ field }) => (
            <FormItem className="space-y-3 p-4 border rounded-lg">
              <FormLabel className="text-base">Select Winner</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="player1" disabled={!player1Name} />
                    </FormControl>
                    <FormLabel className="font-normal">{player1Name || "Player 1"}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="player2" disabled={!player2Name} />
                    </FormControl>
                    <FormLabel className="font-normal">{player2Name || "Player 2"}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="w-full font-headline text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90 rounded-md box-glow-accent transition-all"
        >
          {isPending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Submit Results"}
        </Button>
      </form>
    </Form>
  );
}
