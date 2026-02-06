'use server';

/**
 * @fileOverview Allows users to ask questions about uploaded documents and receive summarized answers with references to the document.
 * 
 * - answerQuestionsAboutDocuments - A function that handles the process of answering questions about documents.
 * - AnswerQuestionsAboutDocumentsInput - The input type for the answerQuestionsAboutDocuments function.
 * - AnswerQuestionsAboutDocumentsOutput - The return type for the answerQuestionsAboutDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutDocumentsInputSchema = z.object({
  question: z.string().describe('The question to ask about the document.'),
  documentContent: z.string().describe('The content of the document as a string.'),
});
export type AnswerQuestionsAboutDocumentsInput = z.infer<
  typeof AnswerQuestionsAboutDocumentsInputSchema
>;

const AnswerQuestionsAboutDocumentsOutputSchema = z.object({
  answer: z.string().describe('The summarized answer to the question.'),
  references: z.string().describe('References to the document content used to generate the answer.'),
});
export type AnswerQuestionsAboutDocumentsOutput = z.infer<
  typeof AnswerQuestionsAboutDocumentsOutputSchema
>;

export async function answerQuestionsAboutDocuments(
  input: AnswerQuestionsAboutDocumentsInput
): Promise<AnswerQuestionsAboutDocumentsOutput> {
  return answerQuestionsAboutDocumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutDocumentsPrompt',
  input: {schema: AnswerQuestionsAboutDocumentsInputSchema},
  output: {schema: AnswerQuestionsAboutDocumentsOutputSchema},
  prompt: `Answer the following question based on the provided document content. Provide references to the specific sections of the document that support your answer.\n\nQuestion: {{{question}}}\n\nDocument Content: {{{documentContent}}}\n\nAnswer and References:`,
});

const answerQuestionsAboutDocumentsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutDocumentsFlow',
    inputSchema: AnswerQuestionsAboutDocumentsInputSchema,
    outputSchema: AnswerQuestionsAboutDocumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
