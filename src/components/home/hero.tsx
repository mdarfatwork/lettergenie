import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 lg:space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              LetterGenie
            </h1>

            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
              Instantly craft tailored cover letters with AI
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-[#5C6AC4] hover:bg-[#4C5AA3] text-white px-8 py-3 text-lg font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Image/Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Magic Lamp/Genie Lamp Illustration */}
              <div className="w-80 h-80 sm:w-96 sm:h-96 relative">
                {/* Lamp Base */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-40 h-24 bg-[#5C6AC4] rounded-full relative">
                    {/* Lamp Spout */}
                    <div className="absolute -top-6 right-4 w-16 h-12 bg-[#5C6AC4] rounded-full transform rotate-12"></div>
                    {/* Lamp Handle */}
                    <div className="absolute top-2 -right-8 w-8 h-16 border-4 border-[#5C6AC4] bg-transparent rounded-full"></div>
                  </div>
                </div>

                {/* Floating Documents */}
                <div className="absolute top-8 left-8 w-12 h-16 bg-white border-2 border-[#5C6AC4] rounded-lg shadow-lg transform rotate-12 opacity-80">
                  <div className="p-2 space-y-1">
                    <div className="w-full h-1 bg-[#5C6AC4] rounded"></div>
                    <div className="w-3/4 h-1 bg-[#5C6AC4] rounded"></div>
                    <div className="w-full h-1 bg-[#5C6AC4] rounded"></div>
                  </div>
                </div>

                <div className="absolute top-4 right-8 w-14 h-18 bg-white border-2 border-[#5C6AC4] rounded-lg shadow-lg transform -rotate-6 opacity-90">
                  <div className="p-2 space-y-1">
                    <div className="w-full h-1 bg-[#5C6AC4] rounded"></div>
                    <div className="w-2/3 h-1 bg-[#5C6AC4] rounded"></div>
                    <div className="w-full h-1 bg-[#5C6AC4] rounded"></div>
                    <div className="w-3/4 h-1 bg-[#5C6AC4] rounded"></div>
                  </div>
                </div>

                {/* Sparkles */}
                <div className="absolute top-16 left-16 w-2 h-2 bg-[#5C6AC4] rounded-full animate-pulse"></div>
                <div className="absolute top-12 right-16 w-1 h-1 bg-[#5C6AC4] rounded-full animate-pulse delay-200"></div>
                <div className="absolute bottom-32 left-12 w-1.5 h-1.5 bg-[#5C6AC4] rounded-full animate-pulse delay-500"></div>
                <div className="absolute bottom-28 right-12 w-1 h-1 bg-[#5C6AC4] rounded-full animate-pulse delay-700"></div>
                <div className="absolute top-24 left-24 w-1 h-1 bg-[#5C6AC4] rounded-full animate-pulse delay-1000"></div>
                <div className="absolute top-20 right-24 w-1.5 h-1.5 bg-[#5C6AC4] rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
