"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { leagueSchema } from "@/lib/schemas";
import { createLeague } from "@/app/actions";
import { DialogFooter, DialogClose } from "./ui/dialog";


export function CreateLeagueForm() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof leagueSchema>>({
    resolver: zodResolver(leagueSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof leagueSchema>) {
    startTransition(async () => {
      const result = await createLeague(values);
      if (result?.error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
        });
      } else {
        toast({
            title: "League Created",
            description: `The "${values.name}" league has been created.`,
        });
        form.reset();
        document.getElementById('close-dialog')?.click();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>League Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'Pro Circuit'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
            <DialogClose asChild>
                <Button id="close-dialog" type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
