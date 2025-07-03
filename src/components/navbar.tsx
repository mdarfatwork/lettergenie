import { NotepadText } from "lucide-react";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="flex items-center gap-2">
        <NotepadText className="w-8 h-8 text-[#5C6AC4]" />
        <span className="text-3xl font-semibold">LetterGenie</span>
      </h1>
      <ul>
        <li className="inline-block mr-4">
          <Button className="lg:text-lg cursor-pointer text-white bg-[#5C6AC4]">
            Sign Up
          </Button>
        </li>
        <li className="inline-block">
          <Button variant="outline" className="lg:text-lg cursor-pointer">
            Sign In
          </Button>
        </li>
      </ul>
    </nav>
  );
}
