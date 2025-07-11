import CoverLetter from "@/components/cover/cover-letter";
import { Button } from "@/components/ui/button";
import {
  checkIfUserProfileExists,
  getCoverLetterByClerkId,
} from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const coverLetter = await getCoverLetterByClerkId(userId);
  const userProfileExists = await checkIfUserProfileExists();

  return (
    <>
      {userProfileExists ? (
        <CoverLetter coverLetter={coverLetter} />
      ) : (
        <section className="min-h-screen container max-w-5xl mx-auto text-center pt-20 space-y-4">
          <h2 className="text-2xl font-semibold">Your Profile is Incomplete</h2>
          <p className="lg:text-lg">
            Please complete your profile to generate a cover letter.
          </p>
          <Link href="/profile">
            <Button className="text-white bg-[#5C6AC4] hover:bg-[#4C5DB8] transition-colors duration-200 cursor-pointer">
              Go to Profile
            </Button>
          </Link>
        </section>
      )}
    </>
  );
}
