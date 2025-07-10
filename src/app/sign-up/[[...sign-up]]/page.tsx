import { SignUp } from "@clerk/nextjs";

export default async function Page() {
  return (
    <section className="flex items-center justify-center h-screen">
      <SignUp />
    </section>
  );
}
