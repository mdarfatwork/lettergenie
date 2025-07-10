"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CoverLetterData } from "@/lib/queries";
import { cn } from "@/lib/utils";
import ViewCoverLetter from "./view-cover-letter";
import GenerateCoverLetter from "./generate-cover-letter";
import { useSetAtom } from "jotai";
import { coverLetterFormOpenAtom } from "@/lib/atoms";

interface Props {
  coverLetter?: CoverLetterData | null;
}

export default function CoverLetter({ coverLetter }: Props) {
  const setIsOpen = useSetAtom(coverLetterFormOpenAtom);

  return (
    <div className="relative min-h-screen py-12 px-4 container mx-auto">
      {!coverLetter || coverLetter?.length === 0 ? (
        <section className="min-h-screen text-center space-y-6 flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Generate Your Perfect Cover Letter
            </h1>
            <p className="text-lg text-gray-600">
              Create personalized cover letters in seconds
            </p>
          </div>

          <Button
            size="lg"
            className="px-8 py-6 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-[#5C6AC4] hover:bg-[#4C5DB8] cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <FileText className="mr-2 h-5 w-5" />
            Generate Cover Letter
          </Button>
        </section>
      ) : (
        <>
          <div className="absolute top-6 right-6">
            <Button
              onClick={() => setIsOpen(true)}
              className="text-white bg-[#5C6AC4] hover:bg-[#4C5DB8] transition-colors duration-200 cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Cover Letter
            </Button>
          </div>

          <div
            className={cn(
              "grid gap-6 mt-20 max-w-4xl mx-auto",
              coverLetter.length === 2 && "sm:grid-cols-2",
              coverLetter.length >= 3 && "sm:grid-cols-3"
            )}
          >
            {coverLetter.map((letter) => (
              <Card key={letter.id}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">
                    {letter.jobTitle || "Untitled"} at{" "}
                    {letter.companyName || "Unknown"}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Created on{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(letter.createdAt))}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-4 text-gray-800 whitespace-pre-line">
                    {letter.generatedLetter}
                  </p>
                  <ViewCoverLetter letter={letter} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      <GenerateCoverLetter />
    </div>
  );
}
