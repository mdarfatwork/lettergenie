import Feature from "@/components/home/feature";
import Hero from "@/components/home/hero";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const userId = await auth();
  if (userId) redirect("/cover");
  return (
    <main>
      <Hero />
      <Feature />
    </main>
  );
}
