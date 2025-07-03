import { User, FileText, Copy } from "lucide-react";

export default function Feature() {
  const features = [
    {
      icon: <User className="w-8 h-8 text-[#5C6AC4]" />,
      title: "Personalized Prompts",
      description: "AI tailors every letter to your job description.",
    },
    {
      icon: <FileText className="w-8 h-8 text-[#5C6AC4]" />,
      title: "Save & Manage",
      description: "Keep all your letters in one secure dashboard",
    },
    {
      icon: <Copy className="w-8 h-8 text-[#5C6AC4]" />,
      title: "One-Click Copy",
      description: "Export as PDF or copy instantly",
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon Container */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#5C6AC4]/10 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
