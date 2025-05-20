'use server';

/**
 * @fileOverview Provides category suggestions for tasks using AI.
 *
 * - suggestTaskCategory - A function that suggests categories for a given task name.
 * - SuggestTaskCategoryInput - The input type for the suggestTaskCategory function.
 * - SuggestTaskCategoryOutput - The return type for the suggestTaskCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskCategoryInputSchema = z.object({
  taskName: z.string().describe('The name of the task to categorize.'),
});
export type SuggestTaskCategoryInput = z.infer<typeof SuggestTaskCategoryInputSchema>;

const SuggestTaskCategoryOutputSchema = z.object({
  categorySuggestions: z
    .array(z.string())
    .describe('An array of suggested categories for the task.'),
});
export type SuggestTaskCategoryOutput = z.infer<typeof SuggestTaskCategoryOutputSchema>;

export async function suggestTaskCategory(input: SuggestTaskCategoryInput): Promise<SuggestTaskCategoryOutput> {
  return suggestTaskCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskCategoryPrompt',
  input: {schema: SuggestTaskCategoryInputSchema},
  output: {schema: SuggestTaskCategoryOutputSchema},
  prompt: `Suggest relevant categories for the task "{{taskName}}". Return the answer as an array of strings.`,
});

const suggestTaskCategoryFlow = ai.defineFlow(
  {
    name: 'suggestTaskCategoryFlow',
    inputSchema: SuggestTaskCategoryInputSchema,
    outputSchema: SuggestTaskCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
