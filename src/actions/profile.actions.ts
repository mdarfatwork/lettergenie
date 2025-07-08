"use server";

import { profileSchema } from "@/lib/zod-schemas";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

export const addProfile = actionClient
  .inputSchema(profileSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const {
        fullName,
        phone,
        email,
        location,
        linkedinUrl,
        websiteUrl,
        githubUrl,
        currentJobTitle,
        yearsOfExperience,
        bio,
        workExperience,
        skills,
        achievements,
      } = parsedInput;

      // Check if profile already exists
      const existingProfile = await db.userProfile.findUnique({
        where: { clerkId: userId },
      });

      if (existingProfile) {
        // Update existing profile
        const updatedProfile = await db.userProfile.update({
          where: { clerkId: userId },
          data: {
            fullName,
            phone: phone || null,
            location: location || null,
            linkedinUrl: linkedinUrl || null,
            websiteUrl: websiteUrl || null,
            githubUrl: githubUrl || null,
            currentJobTitle: currentJobTitle || null,
            yearsOfExperience: yearsOfExperience || null,
            bio: bio || null,
            skills: skills || [],
            achievements: achievements || [],
            // Delete existing work experience and create new ones
            workExperience: {
              deleteMany: {}, // Delete all existing work experience
              create:
                workExperience?.map((exp) => ({
                  title: exp.title,
                  company: exp.company,
                  startDate: exp.startDate,
                  endDate: exp.endDate || null,
                  summary: exp.summary,
                })) || [],
            },
          },
          include: {
            workExperience: true,
          },
        });

        return {
          success: true,
          message: "Profile updated successfully",
          profile: updatedProfile,
        };
      } else {
        // Create new profile
        const newProfile = await db.userProfile.create({
          data: {
            clerkId: userId,
            email,
            fullName,
            phone: phone || null,
            location: location || null,
            linkedinUrl: linkedinUrl || null,
            websiteUrl: websiteUrl || null,
            githubUrl: githubUrl || null,
            currentJobTitle: currentJobTitle || null,
            yearsOfExperience: yearsOfExperience || null,
            bio: bio || null,
            skills: skills || [],
            achievements: achievements || [],
            workExperience: {
              create:
                workExperience?.map((exp) => ({
                  title: exp.title,
                  company: exp.company,
                  startDate: exp.startDate,
                  endDate: exp.endDate || null,
                  summary: exp.summary,
                })) || [],
            },
          },
          include: {
            workExperience: true,
          },
        });

        return {
          success: true,
          message: "Profile created successfully",
          profile: newProfile,
        };
      }
    } catch (error) {
      console.error("Profile save error:", error);

      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to save profile",
      };
    } finally {
      revalidatePath("/profile");
    }
  });
