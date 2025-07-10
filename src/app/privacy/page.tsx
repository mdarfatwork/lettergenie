import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | LetterGenie",
  description:
    "Read our privacy policy to learn how we collect, use, and protect your personal information on LetterGenie.",
};

export default function Page() {
  return (
    <main className="container max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-600 mb-6 text-sm">Last updated: July 10, 2025</p>

      <Separator className="mb-8" />

      <section className="space-y-6 text-base text-gray-800">
        <p>
          At LetterGenie, your privacy is very important to us. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our website or services.
        </p>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            1. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Account Information:</strong> We use Clerk for secure
              authentication and collect your name, email, and optionally
              profile data you choose to provide.
            </li>
            <li>
              <strong>Generated Content:</strong> We store your generated cover
              letters and any input data (e.g., job title, job description) to
              help you access and manage them later.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect anonymized data like page
              views, device type, and browser to improve our services.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>To generate and store cover letters on your behalf.</li>
            <li>To personalize and improve your experience on LetterGenie.</li>
            <li>To ensure account security and service integrity.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">3. Data Storage</h2>
          <p className="mt-2">
            Your data is securely stored in a PostgreSQL database hosted on{" "}
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Neon
            </a>
            . We follow best practices in data encryption and access control to
            keep your information safe.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">4. AI Service Usage</h2>
          <p className="mt-2">
            We use the{" "}
            <a
              href="https://deepmind.google/technologies/gemini/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Gemini API
            </a>{" "}
            to generate cover letters. Input data you provide may be processed
            by Google for content generation. Please refer to Google’s privacy
            policy for more details.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            5. Third-Party Services
          </h2>
          <p className="mt-2">We use the following services:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Clerk:</strong> Handles authentication and session
              management.
            </li>
            <li>
              <strong>Neon:</strong> Database hosting.
            </li>
            <li>
              <strong>Google Gemini:</strong> AI-generated content.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            6. Data Retention & Deletion
          </h2>
          <p className="mt-2">
            You can delete your account or individual cover letters at any time.
            All associated data will be permanently removed from our systems.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">7. Your Rights</h2>
          <p className="mt-2">
            You have the right to access, correct, or delete your personal data.
            If you have any requests or concerns, please contact us using the
            details below.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">8. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about this Privacy Policy, please reach
            out via our{" "}
            <Link href="/contact" className="text-blue-600 underline">
              Contact Page
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
