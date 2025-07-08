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
