"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Copy, Download, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteCoverLetter } from "@/actions/cover.actions";
import { jsPDF } from "jspdf";

interface ViewCoverLetterProps {
  letter: {
    id: string;
    jobTitle: string | null;
    companyName: string | null;
    generatedLetter: string;
  };
}

export default function ViewCoverLetter({ letter }: ViewCoverLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter.generatedLetter);
      setCopied(true);
      toast.success("Cover letter copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error("Copy to clipboard failed:", error);
      setCopied(false);
    }
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();

      const lines = doc.splitTextToSize(letter.generatedLetter, 180);
      doc.setFont("Times", "Normal");
      doc.setFontSize(12);
      doc.text(lines, 15, 20);

      const fileName = `cover-letter-${letter.jobTitle || "untitled"}.pdf`;
      doc.save(fileName);

      toast.success("Cover letter downloaded as PDF!");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      toast.error("Failed to download as PDF");
    }
  };

  const { execute: executeDelete, isExecuting: isExecutingDelete } = useAction(
    deleteCoverLetter,
    {
      onSuccess: () => {
        toast.success("Cover letter deleted successfully!");
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error("Failed to delete cover letter");
        console.error("Delete cover letter error:", error);
      },
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          View Cover Letter
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl md:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {letter.jobTitle || "Untitled"} at {letter.companyName || "Unknown"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={copied}
            className={`cursor-pointer ${copied && "text-green-700"}`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>

        <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed mt-4">
          {letter.generatedLetter}
        </div>

        <div className="flex justify-end pt-6">
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                disabled={isExecutingDelete}
              >
                <Trash className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this cover letter?
                </AlertDialogTitle>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isExecutingDelete}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    executeDelete({ id: letter.id });
                    setIsAlertOpen(false);
                  }}
                  disabled={isExecutingDelete}
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
