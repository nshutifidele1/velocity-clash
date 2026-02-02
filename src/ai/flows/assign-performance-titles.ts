'use server';

/**
 * @fileOverview An AI agent for assigning performance titles (badges) to players based on their match stats.
 *
 * - assignPerformanceTitles - A function that handles the assignment of performance titles.
 */

import {ai} from '@/ai/genkit';
import {
  AssignPerformanceTitlesInputSchema,
  type AssignPerformanceTitlesInput,
  AssignPerformanceTitlesOutputSchema,
  type AssignPerformanceTitlesOutput,
} from '@/ai/types';

export async function assignPerformanceTitles(input: AssignPerformanceTitlesInput): Promise<AssignPerformanceTitlesOutput> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set. Please add it to your .env file.");
    // Return a deterministic response or throw an error
    return {
      player1Title: 'Title Pending',
      player2Title: 'Title Pending',
      commentary: 'AI commentary is currently unavailable. Please configure the API key.'
    };
  }
  return assignPerformanceTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assignPerformanceTitlesPrompt',
  input: {schema: AssignPerformanceTitlesInputSchema},
  output: {schema: AssignPerformanceTitlesOutputSchema},
  prompt: `You are an AI commentator for a futuristic racing game called Velocity Clash.

You are responsible for assigning performance titles (badges) to players based on their match stats and providing a short, entertaining commentary on their performance.

Here are the match stats for the two players:

Player 1: {{player1Name}}
Finishing Position: {{player1FinishingPosition}}
Total Points: {{player1TotalPoints}}
Power-Up Hits: {{player1PowerUpHits}}
{{#if player1LapTime}}
Lap Time: {{player1LapTime}}
{{/if}}

Player 2: {{player2Name}}
Finishing Position: {{player2FinishingPosition}}
Total Points: {{player2TotalPoints}}
Power-Up Hits: {{player2PowerUpHits}}
{{#if player2LapTime}}
Lap Time: {{player2LapTime}}
{{/if}}

Consider the following titles when assigning them:

Match Winner (highest total points)
Most Shooter (highest power-up hits, adjusted for 2-player mode)
Fastest Driver (best lap time or 1st position)
Power Master (best power-up accuracy - not implemented yet)

Assign one title to each player that best reflects their performance in the match, and provide a short Blur-style comment praising their performance. Even if the player did not win, assign them a title and provide them positive feedback.

Output the title and commentary in a JSON format:
{
  "player1Title": "[Title for Player 1]",
  "player2Title": "[Title for Player 2]",
  "commentary": "[Short, entertaining commentary on the match]"
}
`,
});

const assignPerformanceTitlesFlow = ai.defineFlow(
  {
    name: 'assignPerformanceTitlesFlow',
    inputSchema: AssignPerformanceTitlesInputSchema,
    outputSchema: AssignPerformanceTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate titles. Please try again.");
    }
    return output;
  }
);
