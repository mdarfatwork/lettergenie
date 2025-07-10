import z from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
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
});

export const generateCoverLetterSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  customInstructions: z.string().optional(),
});

export const deleteCoverLetterSchema = z.object({
  id: z.string(),
});

export const editCoverLetterSchema = z.object({
  id: z.string(),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),
  customInstructions: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type GenerateCoverLetterFormData = z.infer<
  typeof generateCoverLetterSchema
>;
export type DeleteCoverLetterFormData = z.infer<typeof deleteCoverLetterSchema>;
export type EditCoverLetterFormData = z.infer<typeof editCoverLetterSchema>;
