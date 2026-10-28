import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  MessageCircleQuestion,
  Upload,
} from "lucide-react";
import Navbar from "@shared/components/layout/Navbar";
import Footer from "@shared/components/layout/Footer";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import EMPLOYER_AI_CONTEXT  from "/ai_context/context.txt?raw";

const STARTER_PROMPT =
  "Use the attached employer website context to answer my question. Base your answer only on the information in the file, clearly say when the file does not provide an answer, and do not guess missing dates, policies, costs, contact details, or event logistics. My question is: ";

const STEPS = [
  {
    number: "01",
    title: "Download the context file",
    description:
      "Select the download button below. It saves a plain-text .txt file to your device.",
    icon: Download,
  },
  {
    number: "02",
    title: "Open ChatGPT",
    description:
      "Start a new chat in ChatGPT. Sign in if ChatGPT asks you to.",
    icon: MessageCircleQuestion,
  },
  {
    number: "03",
    title: "Attach the context file",
    description:
      "Use the attachment (+ or paperclip) control beside the message box and select employer-website-context.txt.",
    icon: Upload,
  },
  {
    number: "04",
    title: "Ask your question",
    description:
      "Type a question along with the file. ChatGPT can use the included context to help you find relevant information.",
    icon: CheckCircle2,
  },
];

export default function AiPage() {
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([EMPLOYER_AI_CONTEXT], {
      type: "text/plain;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "ceas-tribunal-context.txt";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    setDownloaded(true);
  };

  const handleCopyPrompt = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(STARTER_PROMPT);
      setCopied(true);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-screen bg-white">
        <section className="py-14 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E00122]">
                Employer resources
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#333333] sm:text-4xl lg:text-5xl">
                Get answers about CEAS Tribunal
              </h1>
              
            </motion.div>

            <motion.div
              className="mx-auto mt-10 max-w-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
            >
              <Card className="overflow-hidden border-gray-200 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E00122]/10 text-[#E00122]">
                        <FileText aria-hidden="true" className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-[#333333]">
                          CEAS Tribunal context
                        </h2>
                        
                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                          Includes the CEAS Tribunal details currently available, 
                          plus guidance to help ChatGPT avoid
                          guessing when information is missing.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleDownload}
                      className="shrink-0 rounded-md bg-[#E00122] text-white hover:bg-[#B8011C]"
                    >
                      <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                      Download .txt file
                    </Button>
                  </div>
                  {downloaded && (
                    <p className="mt-5 flex items-center gap-2 text-sm font-medium text-green-700" role="status" aria-live="polite">
                      <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                      Download started. Continue with the steps below.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.section
              className="mt-16"
              aria-labelledby="how-it-works"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.14 }}
            >
              <div className="mb-7 text-center">
                <h2 id="how-it-works" className="text-2xl font-bold tracking-tight text-[#333333] sm:text-3xl">
                  How to use the file in ChatGPT
                </h2>
                <p className="mt-2 text-gray-600">
                  Four quick steps to start asking questions.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.16 + index * 0.06 }}
                    >
                      <Card className="h-full border-gray-200">
                        <CardHeader>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-bold tracking-wider text-[#E00122]">
                              {step.number}
                            </span>
                            <Icon aria-hidden="true" className="h-5 w-5 text-[#E00122]" />
                          </div>
                          <CardTitle className="text-lg text-[#333333]">{step.title}</CardTitle>
                          <CardDescription className="text-sm leading-6 text-gray-600">
                            {step.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section
              className="mt-14"
              aria-label="Example question and context note"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageCircleQuestion aria-hidden="true" className="h-5 w-5 text-[#E00122]" />
                    <CardTitle className="text-xl text-[#333333]">
                      Start with a useful prompt
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    After attaching the file, ask a specific question. For example:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm leading-6 text-gray-700">
                      {STARTER_PROMPT}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyPrompt}
                      className="rounded-md border-gray-300 text-[#333333]"
                    >
                      {copied ? (
                        <CheckCircle2 aria-hidden="true" className="mr-2 h-4 w-4" />
                      ) : (
                        <Copy aria-hidden="true" className="mr-2 h-4 w-4" />
                      )}
                      {copied ? "Prompt copied" : "Copy starter prompt"}
                    </Button>
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      then add your question <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </span>
                  </div>
                  {copyError && (
                    <p className="mt-3 text-sm text-red-700" role="status">
                      Your browser blocked clipboard access. You can select and copy the example prompt manually.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
