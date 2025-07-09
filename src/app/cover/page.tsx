import CoverLetter from "@/components/cover/cover-letter";
import { getCoverLetterByClerkId } from "@/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const coverLetter = await getCoverLetterByClerkId(userId);
  return <CoverLetter coverLetter={coverLetter} />;
}
