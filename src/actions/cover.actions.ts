"use server";

import { generateCoverLetterSchema } from "@/lib/zod-schemas";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const generateCoverLetter = actionClient
  .inputSchema(generateCoverLetterSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const { jobTitle, companyName, jobDescription, customInstructions } =
        parsedInput;

      // Get user profile for context
      const userProfile = await db.userProfile.findUnique({
        where: { clerkId: userId },
        include: {
          workExperience: {
            orderBy: { startDate: "desc" },
          },
        },
      });

      // Create a comprehensive prompt for cover letter generation
      const prompt = `
You are a professional cover letter writer.

Generate a modern, concise, and personalized cover letter in a natural tone (3–4 paragraphs max). Avoid placeholders like [Date], [Company Name], or [Hiring Manager Name].

Instead, start directly with "Dear Hiring Manager," and structure it like a real-world ready-to-send letter that could be emailed or attached to a job application.

Use the following input data to craft the letter:

JOB DETAILS:
- Job Title: ${jobTitle || "N/A"}
- Company Name: ${companyName || "N/A"}
- Job Description: ${jobDescription}

${
  userProfile
    ? `
APPLICANT PROFILE:
- Full Name: ${userProfile.fullName}
- Current Job Title: ${userProfile.currentJobTitle || "N/A"}
- Years of Experience: ${userProfile.yearsOfExperience || "N/A"}
- Skills: ${userProfile.skills?.join(", ") || "N/A"}
- Achievements: ${userProfile.achievements?.join(", ") || "N/A"}
- Bio: ${userProfile.bio || "N/A"}
- Location: ${userProfile.location || "N/A"}

WORK EXPERIENCE:
${userProfile.workExperience
  .map(
    (exp: {
      title: string;
      company: string;
      startDate: Date;
      endDate: Date | null;
      summary: string;
    }) =>
      `- ${exp.title} at ${
        exp.company
      } (${exp.startDate.toLocaleDateString()} - ${
        exp.endDate ? exp.endDate.toLocaleDateString() : "Present"
      }): ${exp.summary}`
  )
  .join("\n")}
`
    : ""
}

${customInstructions ? `EXTRA INSTRUCTIONS:\n${customInstructions}` : ""}

REQUIREMENTS:
1. Use natural, professional language.
2. Do not use placeholder tokens like [Company Name], [Your Name], or [Date].
3. Highlight the applicant’s relevant experience and strengths.
4. Keep the tone engaging and enthusiastic.
5. Begin with “Dear Hiring Manager,”
6. End with a short thank-you and “Sincerely, [Full Name]” (use user's name if available).
7. Avoid repetition. No excessive fluff.

Output only the cover letter content (no markdown, no explanations).
`;

      // Generate cover letter using Gemini AI
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: prompt,
      });

      const generatedLetter = response.text;

      if (!generatedLetter) {
        throw new Error("Failed to generate cover letter content");
      }

      // Save cover letter to database
      const savedCoverLetter = await db.coverLetter.create({
        data: {
          clerkId: userId,
          profileId: userProfile?.id,
          jobDescription,
          customInstructions: customInstructions || null,
          generatedLetter,
          jobTitle,
          companyName,
        },
      });

      revalidatePath("/cover");

      return {
        success: true,
        coverLetter: {
          id: savedCoverLetter.id,
          content: generatedLetter,
          jobTitle: savedCoverLetter.jobTitle,
          companyName: savedCoverLetter.companyName,
          createdAt: savedCoverLetter.createdAt,
        },
      };
    } catch (error) {
      console.error("Error generating cover letter:", error);
      throw new Error("Failed to generate cover letter. Please try again.");
    }
  });
