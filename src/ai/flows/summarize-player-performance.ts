'use server';

/**
 * @fileOverview A flow that generates short, Blur-style comments praising player performance after each match.
 *
 * - summarizePlayerPerformance - A function that handles the generation of performance summaries.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizePlayerPerformanceInputSchema,
  type SummarizePlayerPerformanceInput,
  SummarizePlayerPerformanceOutputSchema,
  type SummarizePlayerPerformanceOutput,
} from '@/ai/types';

export async function summarizePlayerPerformance(input: SummarizePlayerPerformanceInput): Promise<SummarizePlayerPerformanceOutput> {
  return summarizePlayerPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePlayerPerformancePrompt',
  input: {schema: SummarizePlayerPerformanceInputSchema},
  output: {schema: SummarizePlayerPerformanceOutputSchema},
  prompt: `You are a commentator for a racing game called Blur. Generate a short, one-sentence comment praising the player's performance based on the following stats:

Player Name: {{playerName}}
Finishing Position: {{finishingPosition}}
Total Points: {{totalPoints}}
Power-Up Hits: {{powerUpHits}}
{{#if lapTime}}
Lap Time: {{lapTime}}
{{else}}
Speed Rank: {{speedRank}}
{{/if}}

Output the comment in a JSON format:
{
  "comment": "[Your one-sentence comment here]"
}`,
});

const summarizePlayerPerformanceFlow = ai.defineFlow(
  {
    name: 'summarizePlayerPerformanceFlow',
    inputSchema: SummarizePlayerPerformanceInputSchema,
    outputSchema: SummarizePlayerPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
