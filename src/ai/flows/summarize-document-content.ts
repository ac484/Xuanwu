'use server';

/**
 * @fileOverview Summarizes the content of a document.
 *
 * - summarizeDocumentContent - A function that accepts document text and returns a concise summary.
 * - SummarizeDocumentContentInput - The input type for the summarizeDocumentContent function.
 * - SummarizeDocumentContentOutput - The return type for the summarizeDocumentContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentContentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to be summarized.'),
});

export type SummarizeDocumentContentInput = z.infer<
  typeof SummarizeDocumentContentInputSchema
>;

const SummarizeDocumentContentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document content.'),
});

export type SummarizeDocumentContentOutput = z.infer<
  typeof SummarizeDocumentContentOutputSchema
>;

export async function summarizeDocumentContent(
  input: SummarizeDocumentContentInput
): Promise<SummarizeDocumentContentOutput> {
  return summarizeDocumentContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentContentPrompt',
  input: {schema: SummarizeDocumentContentInputSchema},
  output: {schema: SummarizeDocumentContentOutputSchema},
  prompt: `Summarize the following document content in a concise manner:\n\n{{{{documentText}}}}}`, // Escaped brackets
});

const summarizeDocumentContentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentContentFlow',
    inputSchema: SummarizeDocumentContentInputSchema,
    outputSchema: SummarizeDocumentContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
