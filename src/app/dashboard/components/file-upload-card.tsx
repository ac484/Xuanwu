
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useDashboardStore, Feature } from "../store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, FileText, BotMessageSquare, FileJson, Sparkles, Loader2 } from "lucide-react";

const featureConfig = {
  extract: {
    icon: FileJson,
    title: "Extract Data",
    description: "Define fields in natural language to extract structured data.",
  },
  summarize: {
    icon: FileText,
    title: "Summarize",
    description: "Get a concise summary of the document's content.",
  },
  qa: {
    icon: BotMessageSquare,
    title: "Q&A",
    description: "Ask questions and get answers from the document.",
  },
};

export function FileUploadCard() {
  const {
    file,
    feature,
    extractionFields,
    question,
    isLoading,
    setFile,
    setFeature,
    setExtractionFields,
    setQuestion,
    processFile,
  } = useDashboardStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const canProcess = () => {
    if (!file) return false;
    if (feature === 'extract' && !extractionFields.trim()) return false;
    if (feature === 'qa' && !question.trim()) return false;
    return true;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>Document Processor</span>
        </CardTitle>
        <CardDescription>Upload a document and choose an AI-powered action.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="w-10 h-10" />
            {file ? (
              <p className="font-semibold text-foreground">{file.name}</p>
            ) : isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <p>Drag & drop a document, or click to select</p>
            )}
          </div>
        </div>

        <Tabs value={feature} onValueChange={(value) => setFeature(value as Feature)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="extract">Extract</TabsTrigger>
            <TabsTrigger value="summarize">Summarize</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4 h-10">{featureConfig[feature].description}</p>
            <TabsContent value="extract" className="m-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="extraction-fields">Extraction Fields</Label>
                <Textarea
                  id="extraction-fields"
                  placeholder="e.g., 'Invoice number, total amount, and due date'"
                  value={extractionFields}
                  onChange={(e) => setExtractionFields(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="summarize" className="m-0"></TabsContent>
            <TabsContent value="qa" className="m-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Input
                  id="question"
                  placeholder="e.g., 'What is the penalty for late payment?'"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Button
          onClick={processFile}
          disabled={!canProcess() || isLoading}
          className="w-full font-bold text-lg h-12"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Processing..." : "Run AI"}
        </Button>
      </CardContent>
    </Card>
  );
}
