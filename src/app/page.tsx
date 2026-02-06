"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, FileJson, FileSearch, BotMessageSquare } from "lucide-react";
import { Header } from "@/components/layout/header";

const features = [
  {
    icon: <FileJson className="w-8 h-8 text-primary" />,
    title: "Zero-Shot Extraction",
    description: "Define extraction fields in natural language. No templates needed.",
  },
  {
    icon: <FileSearch className="w-8 h-8 text-primary" />,
    title: "Semantic Summary",
    description: "Generate summaries of lengthy clauses and identify legal risks.",
  },
  {
    icon: <BotMessageSquare className="w-8 h-8 text-primary" />,
    title: "Interactive Retrieval",
    description: "Ask questions in natural language to get summarized answers from your documents.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-8 text-center">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground font-headline">
                    Unlock Insights from Your Documents
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                    GeminiDocuMind leverages generative AI to extract, summarize, and analyze information from any document, instantly.
                  </p>
                </div>
                <div className="w-full max-w-sm sm:max-w-md mx-auto">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full text-lg h-14 rounded-full font-bold shadow-lg shadow-primary/20">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
               <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Intelligence at Your Fingertips</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Go beyond simple OCR. GeminiDocuMind understands context, layout, and semantics to deliver unparalleled document intelligence.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-4 p-6 rounded-lg bg-card border shadow-sm">
                  <div className="p-3 rounded-full bg-primary/10 w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} GeminiDocuMind. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
