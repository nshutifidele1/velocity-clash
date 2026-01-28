'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { autoGenerateMatch } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function GenerateMatchesButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const result = await autoGenerateMatch();
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: result.error,
        });
      } else {
        toast({
          title: 'Match Generated!',
          description: 'A new match has been successfully generated.',
        });
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Auto-generate Match
    </Button>
  );
}
