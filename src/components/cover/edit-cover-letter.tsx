"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CoverLetterData } from "@/lib/queries";
import { Button } from "../ui/button";
import { useState } from "react";
import { Edit2, Sparkles } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  EditCoverLetterFormData,
  editCoverLetterSchema,
} from "@/lib/zod-schemas";
import { editCoverLetter } from "@/actions/cover.actions";

interface Props {
  letter: NonNullable<CoverLetterData>[number];
}

export default function EditCoverLetter({ letter }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EditCoverLetterFormData>({
    resolver: zodResolver(editCoverLetterSchema),
    defaultValues: {
      id: letter.id,
      jobTitle: letter.jobTitle,
      companyName: letter.companyName,
      jobDescription: letter.jobDescription,
      customInstructions:
        letter.customInstructions == null
          ? undefined
          : letter.customInstructions,
    },
  });

  const customInstructions = form.watch("customInstructions");
  const maxCustomInstructionsLength = 500;

  const { execute, isExecuting } = useAction(editCoverLetter, {
    onSuccess: (result) => {
      if (result.data?.success && result.data.coverLetter) {
        toast.success("Cover letter edited successfully!");
        setIsOpen(false);
        form.reset();
      }
    },
    onError: (error) => {
      toast.error("Failed to edit cover letter. Please try again.");
      console.error("Error editing cover letter:", error);
    },
  });

  const handleCancel = () => {
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="cursor-pointer">
          <Edit2 className="w-4 h-4 mr-1" />
          Edit Cover Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Cover Letter</DialogTitle>
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
