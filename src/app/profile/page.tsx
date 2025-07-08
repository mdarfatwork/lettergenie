import ProfileForm from "@/components/profile-form";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileByEmail } from "@/lib/queries";
import { ProfileFormData } from "@/lib/zod-schemas";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/");

  const userEmail = user.emailAddresses[0]?.emailAddress || "";
  const existingProfile = await getProfileByEmail(userEmail);

  return (
    <div className="min-h-screen">
      <div className="py-8">
        <ProfileForm
          userEmail={user.emailAddresses[0]?.emailAddress || ""}
          initialData={existingProfile as Partial<ProfileFormData>}
        />
      </div>
      <div className="flex items-center justify-center">
        <SignOutButton>
          <Button
            variant="destructive"
            className="text-sm bg-red-600 hover:bg-red-700 text-white cursor-pointer mx-auto"
          >
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
