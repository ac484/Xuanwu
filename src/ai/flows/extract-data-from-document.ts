'use server';
/**
 * @fileOverview Extracts data from a document based on natural language extraction field definitions.
 *
 * - extractDataFromDocument - Extracts data from a document using a natural language description of the fields to extract.
 * - ExtractDataFromDocumentInput - The input type for the extractDataFromDocument function.
 * - ExtractDataFromDocumentOutput - The return type for the extractDataFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDataFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document to extract data from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  extractionFieldsDescription: z
    .string()
    .describe(
      'A natural language description of the fields to extract from the document.'
    ),
});
export type ExtractDataFromDocumentInput = z.infer<
  typeof ExtractDataFromDocumentInputSchema
>;

const ExtractDataFromDocumentOutputSchema = z.object({
  extractedData: z
    .string()
    .describe(
      'The extracted data from the document, in JSON format.'
    ),
});
export type ExtractDataFromDocumentOutput = z.infer<
  typeof ExtractDataFromDocumentOutputSchema
>;

export async function extractDataFromDocument(
  input: ExtractDataFromDocumentInput
): Promise<ExtractDataFromDocumentOutput> {
  return extractDataFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDataFromDocumentPrompt',
  input: {schema: ExtractDataFromDocumentInputSchema},
  output: {schema: ExtractDataFromDocumentOutputSchema},
  prompt: `You are an expert data extraction specialist.\n
  Given the following document: {{media url=documentDataUri}}\n  And the following description of the fields to extract: {{{extractionFieldsDescription}}}\n
  Extract the data from the document and return it in JSON format.\n  Ensure the JSON format matches the described fields.\n  `,
});

const extractDataFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractDataFromDocumentFlow',
    inputSchema: ExtractDataFromDocumentInputSchema,
    outputSchema: ExtractDataFromDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
