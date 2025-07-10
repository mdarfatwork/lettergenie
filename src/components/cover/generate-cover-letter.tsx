"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { generateCoverLetter } from "@/actions/cover.actions";
import { toast } from "sonner";
import {
  GenerateCoverLetterFormData,
  generateCoverLetterSchema,
} from "@/lib/zod-schemas";
import { useAtom } from "jotai";
import { coverLetterFormOpenAtom } from "@/lib/atoms";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const isDev = process.env.NODE_ENV === "development";

export default function GenerateCoverLetter() {
  const [isOpen, setIsOpen] = useAtom(coverLetterFormOpenAtom);

  const form = useForm<GenerateCoverLetterFormData>({
    resolver: zodResolver(generateCoverLetterSchema),
    defaultValues: {
      jobTitle: isDev ? "Frontend Developer" : "",
      companyName: isDev ? "TechNova Inc." : "",
      jobDescription: isDev
        ? "We are seeking a skilled Frontend Developer with experience in React and Next.js. Responsibilities include building and optimizing user interfaces, collaborating with designers and backend developers, and ensuring cross-browser compatibility."
        : "",
      customInstructions: isDev
        ? "Keep the tone professional and enthusiastic. Emphasize experience with modern UI libraries and performance optimization."
        : "",
    },
  });

  const customInstructions = form.watch("customInstructions");
  const maxCustomInstructionsLength = 500;

  const { execute, isExecuting } = useAction(generateCoverLetter, {
    onSuccess: (result) => {
      if (result.data?.success && result.data.coverLetter) {
        toast.success("Cover letter generated successfully!");
        setIsOpen(false);
        form.reset();
      }
    },
    onError: (error) => {
      toast.error("Failed to generate cover letter. Please try again.");
      console.error("Error generating cover letter:", error);
    },
  });

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Generate Cover Letter
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(execute)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Job Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="job-title"
                      placeholder="e.g., Frontend Developer"
                      {...field}
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Company Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="company-name"
                      placeholder="e.g., Google"
                      {...field}
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Job Description *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description here..."
                      className="resize-none"
                      {...field}
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Custom Instructions (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="custom-instructions"
                      placeholder="Add any specific instructions or requirements for your cover letter..."
                      {...field}
                      disabled={isExecuting}
                      className={`min-h-[100px] resize-none ${
                        customInstructions &&
                        customInstructions.length > maxCustomInstructionsLength
                          ? "border-red-500"
                          : ""
                      }`}
                      maxLength={maxCustomInstructionsLength}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Optional: Add specific requirements, tone, or formatting
                      preferences
                    </p>
                    <p
                      className={`text-xs ${
                        customInstructions &&
                        customInstructions.length > maxCustomInstructionsLength
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {customInstructions?.length || 0}/
                      {maxCustomInstructionsLength}
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isExecuting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isExecuting}
                className="text-white bg-[#5C6AC4] hover:bg-[#4C5DB8] transition-colors duration-200 cursor-pointer"
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
