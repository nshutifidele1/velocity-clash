"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { playerStatsOnlySchema } from "@/lib/schemas";
import type { UpcomingMatch } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface EnterResultsFormProps {
  upcomingMatch: UpcomingMatch;
}

// We only need the stats from the form, player names are fixed.
const statsOnlySchema = z.object({
    player1: playerStatsOnlySchema,
    player2: playerStatsOnlySchema,
    winner: z.enum(['player1', 'player2'], { required_error: "You must select a winner." }),
});


export function EnterResultsForm({ upcomingMatch }: EnterResultsFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof statsOnlySchema>>({
    resolver: zodResolver(statsOnlySchema),
    defaultValues: {
      player1: {
        totalPoints: 0,
        powerUpHits: 0,
        lapTime: '',
        fansGained: '',
      },
      player2: {
        totalPoints: 0,
        powerUpHits: 0,
        lapTime: '',
        fansGained: '',
      },
    },
  });

  function onSubmit(values: z.infer<typeof statsOnlySchema>) {
    const fullValues = {
        player1: { ...values.player1, name: upcomingMatch.player1Name },
        player2: { ...values.player2, name: upcomingMatch.player2Name },
        winner: values.winner,
    };

    startTransition(async () => {
      const result = await submitMatchResults(fullValues, upcomingMatch.id);
      if (result?.error) {
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: result.error,
        });
      }
      // Redirect is handled by the server action
    });
  }

  const renderPlayerFields = (player: "player1" | "player2", playerName: string) => (
    <Card className="w-full bg-transparent border-secondary">
      <CardHeader>
        <CardTitle className="font-headline text-accent text-glow-accent">{playerName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          {renderPlayerFields("player1", upcomingMatch.player1Name)}
          {renderPlayerFields("player2", upcomingMatch.player2Name)}
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
                      <RadioGroupItem value="player1" />
                    </FormControl>
                    <FormLabel className="font-normal">{upcomingMatch.player1Name}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="player2" />
                    </FormControl>
                    <FormLabel className="font-normal">{upcomingMatch.player2Name}</FormLabel>
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
          {isPending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Submit Final Results"}
        </Button>
      </form>
    </Form>
  );
}