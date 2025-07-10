import { NotepadText } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function Navbar() {
  const user = await currentUser();
  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="flex items-center gap-2">
          <NotepadText className="w-8 h-8 text-[#5C6AC4]" />
          <span className="text-3xl font-semibold">LetterGenie</span>
        </h1>
      </Link>
      <ul className="flex flex-col md:flex-row items-center gap-4">
        {user ? (
          <>
            <li>
              <Link href="/cover">
                <Button
                  className="lg:text-lg cursor-pointer"
                  variant="secondary"
                >
                  Cover
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <Button className="lg:text-lg cursor-pointer text-white bg-[#5C6AC4]">
                  Profile
                </Button>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-up">
                <Button className="lg:text-lg cursor-pointer text-white bg-[#5C6AC4]">
                  Sign Up
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/sign-in">
                <Button variant="outline" className="lg:text-lg cursor-pointer">
                  Sign In
                </Button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
