import { NotepadText } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-6 lg:gap-8">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-2 text-center lg:text-left">
            <NotepadText className="w-6 h-6 text-[#5C6AC4]" />
            <span className="text-xl font-bold text-gray-900">LetterGenie</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-center lg:text-right">
            <Link
              href="/terms"
              className="text-gray-600 hover:text-[#5C6AC4] transition-colors duration-200 text-sm font-medium"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-[#5C6AC4] transition-colors duration-200 text-sm font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-[#5C6AC4] transition-colors duration-200 text-sm font-medium"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 my-6"></div>

        {/* Bottom Footer Content */}
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-bold">LetterGenie</span>. All rights reserved.
          {""}
          Made with ❤️ by{" "}
          <Link
            href="https://www.linkedin.com/in/momin-mohammed-arfat/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C6AC4] hover:text-[#4C5AA3] font-medium transition-colors duration-200 underline decoration-1 underline-offset-2"
          >
            Mohammed Arfat
          </Link>
        </p>
      </div>
    </footer>
  );
}
