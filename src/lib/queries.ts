"use server";
import { db } from "@/lib/db";

export async function getProfileByEmail(email: string) {
  try {
    const profile = await db.userProfile.findUnique({
      where: { email },
      include: {
        workExperience: {
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getProfileByClerkId(clerkId: string) {
  try {
    const profile = await db.userProfile.findUnique({
      where: { clerkId },
      include: {
        workExperience: {
          orderBy: {
            startDate: "desc",
          },
        },
      },
    });

    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getCoverLetterByClerkId(clerkId: string) {
  try {
    const coverLetter = await db.coverLetter.findMany({
      where: { clerkId },
      orderBy: { createdAt: "desc" },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    return null;
  }
}

export type UserProfileData = Awaited<ReturnType<typeof getProfileByEmail | typeof getProfileByClerkId>>;
export type CoverLetterData = Awaited<ReturnType<typeof getCoverLetterByClerkId>>;