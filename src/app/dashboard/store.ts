
import { create } from 'zustand';
import {
  extractDataFromDocument,
  ExtractDataFromDocumentInput,
  ExtractDataFromDocumentOutput,
} from '@/ai/flows/extract-data-from-document';
import {
  summarizeDocumentContent,
  SummarizeDocumentContentInput,
  SummarizeDocumentContentOutput,
} from '@/ai/flows/summarize-document-content';
import {
  answerQuestionsAboutDocuments,
  AnswerQuestionsAboutDocumentsInput,
  AnswerQuestionsAboutDocumentsOutput,
} from '@/ai/flows/answer-questions-about-documents';

export type Feature = 'extract' | 'summarize' | 'qa';

type Result = ExtractDataFromDocumentOutput | SummarizeDocumentContentOutput | AnswerQuestionsAboutDocumentsOutput | null;

interface DashboardState {
  file: File | null;
  fileContent: string | null; // as text for summary/QA, as data URI for extraction
  feature: Feature;
  extractionFields: string;
  question: string;
  result: Result;
  isLoading: boolean;
  error: string | null;
  setFile: (file: File | null) => void;
  setFeature: (feature: Feature) => void;
  setExtractionFields: (fields: string) => void;
  setQuestion: (question: string) => void;
  processFile: () => Promise<void>;
  reset: () => void;
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  file: null,
  fileContent: null,
  feature: 'extract',
  extractionFields: '',
  question: '',
  result: null,
  isLoading: false,
  error: null,

  setFile: (file) => {
    set({ file, result: null, error: null });
    if (file) {
      if (get().feature === 'extract') {
        fileToDataUri(file).then((dataUri) => set({ fileContent: dataUri }));
      } else {
        fileToText(file).then((text) => set({ fileContent: text }));
      }
    } else {
      set({ fileContent: null });
    }
  },

  setFeature: (feature) => {
    set({ feature, result: null, error: null });
    const { file } = get();
    if (file) {
      if (feature === 'extract') {
        fileToDataUri(file).then((dataUri) => set({ fileContent: dataUri }));
      } else {
        fileToText(file).then((text) => set({ fileContent: text }));
      }
    }
  },

  setExtractionFields: (fields) => set({ extractionFields: fields }),
  setQuestion: (question) => set({ question: question }),

  processFile: async () => {
    const { feature, fileContent, extractionFields, question, file } = get();
    if (!fileContent || !file) {
      set({ error: 'Please upload a file first.' });
      return;
    }

    set({ isLoading: true, error: null, result: null });

    try {
      let res: Result = null;
      let currentFileContent = fileContent;

      // Ensure content is in the correct format for the selected feature
      if (feature === 'extract' && !fileContent.startsWith('data:')) {
        currentFileContent = await fileToDataUri(file);
        set({ fileContent: currentFileContent });
      } else if ((feature === 'summarize' || feature === 'qa') && fileContent.startsWith('data:')) {
        currentFileContent = await fileToText(file);
        set({ fileContent: currentFileContent });
      }

      switch (feature) {
        case 'extract':
          if (!extractionFields) {
            throw new Error('Please provide a description of the fields to extract.');
          }
          const extractInput: ExtractDataFromDocumentInput = {
            documentDataUri: currentFileContent,
            extractionFieldsDescription: extractionFields,
          };
          res = await extractDataFromDocument(extractInput);
          break;
        case 'summarize':
          const summarizeInput: SummarizeDocumentContentInput = {
            documentText: currentFileContent,
          };
          res = await summarizeDocumentContent(summarizeInput);
          break;
        case 'qa':
          if (!question) {
            throw new Error('Please ask a question about the document.');
          }
          const qaInput: AnswerQuestionsAboutDocumentsInput = {
            documentContent: currentFileContent,
            question: question,
          };
          res = await answerQuestionsAboutDocuments(qaInput);
          break;
      }
      set({ result: res });
    } catch (e: any) {
      set({ error: e.message || 'An unexpected error occurred.' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  reset: () => set({
    file: null,
    fileContent: null,
    extractionFields: '',
    question: '',
    result: null,
    isLoading: false,
    error: null,
  }),
}));
