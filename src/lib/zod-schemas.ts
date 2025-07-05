import { checkFileType } from "@/utils/check-file-type";
import z from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  currentJobTitle: z.string().optional(),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience must be 0 or greater")
    .optional(),
  bio: z.string().optional(),
  workExperience: z
    .array(
      z.object({
        title: z.string().min(1, "Job title is required"),
        company: z.string().min(1, "Company name is required"),
        startDate: z.date({ required_error: "Start date is required" }),
        endDate: z.date().optional(),
        summary: z.string().min(1, "Job summary is required"),
      })
    )
    .optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  achievements: z.array(z.string()).optional(),
  resumeFile: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < 2_000_000, "Max size is 2MB.")
    .refine(
      (file) => !file || checkFileType(file),
      "Only PDF and Word formats are allowed."
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
