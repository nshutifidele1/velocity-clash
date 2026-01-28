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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { submitMatchResults } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { formSchema } from "@/lib/schemas";

interface ManualMatchFormProps {
    players: string[];
}

export function ManualMatchForm({ players }: ManualMatchFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player1: {
        name: "",
        finishingPosition: 1,
        totalPoints: 0,
        powerUpHits: 0,
        lapTime: '',
      },
      player2: {
        name: "",
        finishingPosition: 2,
        totalPoints: 0,
        powerUpHits: 0,
        lapTime: '',
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await submitMatchResults(values);
      if (result?.error) {
        toast({
            variant: "destructive",
            title: "Submission Error",
            description: result.error,
        });
      }
    });
  }

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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="Select a player" />
                      </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                      {players.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${player}.finishingPosition`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
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
        </div>
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
        <Button
          type="submit"
          disabled={isPending}
          className="w-full font-headline text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90 rounded-md box-glow-accent transition-all"
        >
          {isPending ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Submit Match"}
        </Button>
      </form>
    </Form>
  );
}
