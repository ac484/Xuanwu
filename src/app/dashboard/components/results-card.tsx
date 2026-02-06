
"use client";

import { useDashboardStore } from "../store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Bot } from "lucide-react";
import ReactJson from "react-json-view";

const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

const InitialState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 min-h-[400px]">
        <Bot className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">AI Results Panel</h3>
        <p>Your document insights will appear here once processed.</p>
    </div>
);

export function ResultsCard() {
  const { isLoading, error, result } = useDashboardStore();

  const renderResult = () => {
    if (!result) return <InitialState />;

    if ("extractedData" in result) {
      try {
        const jsonData = JSON.parse(result.extractedData);
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Extracted Data</h3>
            <div className="p-4 rounded-md bg-muted/50 border max-h-[600px] overflow-auto">
              <ReactJson 
                src={jsonData}
                name={false}
                iconStyle="square"
                theme="rjv-default"
                style={{ background: 'transparent' }}
                displayDataTypes={false}
                enableClipboard={true}
              />
            </div>
          </div>
        );
      } catch (e) {
        return <p className="text-destructive">Failed to parse extracted JSON data.</p>;
      }
    }

    if ("summary" in result) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="whitespace-pre-wrap leading-relaxed bg-muted/50 p-4 rounded-md border">{result.summary}</p>
        </div>
      );
    }

    if ("answer" in result) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Answer</h3>
          <p className="whitespace-pre-wrap leading-relaxed bg-muted/50 p-4 rounded-md border">{result.answer}</p>
          {result.references && (
            <Accordion type="single" collapsible>
              <AccordionItem value="references">
                <AccordionTrigger>View References</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-wrap text-muted-foreground text-sm bg-muted/50 p-4 rounded-md border">{result.references}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      );
    }
    
    return <InitialState />;
  };

  return (
    <Card className="shadow-lg min-h-[600px]">
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>The output from the AI model will be displayed below.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          renderResult()
        )}
      </CardContent>
    </Card>
  );
}
