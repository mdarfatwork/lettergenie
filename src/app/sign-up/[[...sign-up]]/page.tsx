import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (userId) redirect("/");
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp />
    </div>
  );
}
