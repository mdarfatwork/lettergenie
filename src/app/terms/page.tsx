import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | LetterGenie",
  description: "Please read our Terms of Service before using LetterGenie.",
};

export default function Page() {
  return (
    <main className="container max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Terms of Service
      </h1>
      <p className="text-gray-600 mb-6 text-sm">Last updated: July 10, 2025</p>

      <Separator className="mb-8" />

      <section className="space-y-6 text-base text-gray-800">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of
          LetterGenie (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By
          accessing or using our service, you agree to be bound by these Terms.
          If you do not agree to these Terms, please do not use the service.
        </p>

        <div>
          <h2 className="text-xl font-semibold mt-6">1. Use of Our Service</h2>
          <p className="mt-2">
            LetterGenie provides a tool for generating personalized cover
            letters. You agree to use our service only for lawful purposes and
            in accordance with these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            2. Account Registration
          </h2>
          <p className="mt-2">
            You must create an account to use our service. We use{" "}
            <a
              href="https://clerk.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Clerk
            </a>{" "}
            for secure authentication. You agree to provide accurate and
            complete information when registering and to keep your account
            credentials secure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">3. User Content</h2>
          <p className="mt-2">
            You retain ownership of any data or content you provide, such as job
            descriptions or custom instructions. By using our service, you grant
            us permission to process this content to generate cover letters for
            you.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            4. AI-Generated Content
          </h2>
          <p className="mt-2">
            Our service uses the{" "}
            <a
              href="https://deepmind.google/technologies/gemini/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Google Gemini API
            </a>{" "}
            to generate content. While we strive to ensure high-quality output,
            we cannot guarantee accuracy, appropriateness, or suitability of
            generated content. You are responsible for reviewing and editing any
            content before using it.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">5. Prohibited Use</h2>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Using the service for unlawful or harmful purposes.</li>
            <li>
              Attempting to disrupt, damage, or interfere with the service.
            </li>
            <li>
              Uploading or submitting harmful, offensive, or misleading data.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">6. Termination</h2>
          <p className="mt-2">
            We reserve the right to suspend or terminate your access to the
            service at any time if you violate these Terms or use the service in
            a way that harms others or the platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">7. Data Storage</h2>
          <p className="mt-2">
            Your content is securely stored in a PostgreSQL database hosted on{" "}
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Neon
            </a>
            . We follow industry-standard practices for data protection and
            privacy. You can delete your content or account at any time.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            8. Limitation of Liability
          </h2>
          <p className="mt-2">
            LetterGenie is provided &ldquo;as is.&rdquo; We are not liable for
            any damages, losses, or consequences arising from the use or
            inability to use our service. You agree to use the platform at your
            own risk.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">
            9. Changes to These Terms
          </h2>
          <p className="mt-2">
            We may update these Terms from time to time. Significant changes
            will be notified through the platform or via email. Continued use of
            the service means you accept the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">10. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about these Terms, please reach out via
            our{" "}
            <Link href="/contact" className="text-blue-600 underline">
              Contact Page
            </Link>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">11. Disclaimer</h2>
          <p className="mt-2">
            This Terms of Service page is created solely for project
            demonstration purposes as part of the LetterGenie application. It
            does not constitute a legally binding agreement.
          </p>
        </div>
      </section>
    </main>
  );
}
