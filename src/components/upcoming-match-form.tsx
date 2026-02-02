"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useTransition } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addUpcomingMatch } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { upcomingMatchSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface UpcomingMatchFormProps {
  players: UserProfile[];
}

export function UpcomingMatchForm({ players }: UpcomingMatchFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof upcomingMatchSchema>>({
    resolver: zodResolver(upcomingMatchSchema),
    defaultValues: {
      player1Name: "",
      player2Name: "",
    },
  });

  function onSubmit(values: z.infer<typeof upcomingMatchSchema>) {
    startTransition(async () => {
      const result = await addUpcomingMatch(values);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Match Scheduled!",
          description: "The upcoming match has been added.",
        });
        form.reset();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="player1Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player 1</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a player" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {players.map((player) => (
                        <SelectItem key={player.email} value={player.gamingName}>
                            {player.gamingName}
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
            name="player2Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player 2</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a player" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {players.map((player) => (
                        <SelectItem key={player.email} value={player.gamingName}>
                            {player.gamingName}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Match Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      const newDate = field.value ? new Date(field.value) : new Date();
                      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                      field.onChange(newDate);
                    }}
                  />
                  <div className="p-3 border-t border-border">
                    <div className="flex items-center gap-2">
                        <Input 
                            type="time" 
                            className="w-full"
                            defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                                const [hours, minutes] = e.target.value.split(':').map(Number);
                                const newDate = field.value ? new Date(field.value) : new Date();
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                            }}
                        />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Schedule Match"}
        </Button>
      </form>
    </Form>
  );
}
