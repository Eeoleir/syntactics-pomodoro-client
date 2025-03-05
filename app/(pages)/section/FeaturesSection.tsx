import Image from "next/image";
import phone from "@/public/phone.png";
import turbo from "@/public/turbo.png";
import tools from "@/public/tools.png";
import electric from "@/public/electric.png";
import gift from "@/public/gift.png";
import { FeatureItem } from "./FeatureItem";

interface FeaturesSectionProps {
  readonly isDarkMode: boolean;
}

export function FeaturesSection({ isDarkMode }: FeaturesSectionProps) {
  const getDarkModeClass = (dark: string, light: string) =>
    isDarkMode ? dark : light;

  const features = [
    {
      id: "seamless-focus",
      icon: turbo,
      title: "Seamless Focus Sessions",
      description:
        "Customize your work and break intervals to match your productivity rhythm.",
    },
    {
      id: "task-automation",
      icon: electric,
      title: "Task Automation",
      description: "Automate transitions to keep your workflow smooth.",
    },
    {
      id: "powerful-tools",
      icon: tools,
      title: "Powerful Tools",
      description: "Enhance focus with integrated productivity utilities.",
    },
    {
      id: "reward-system",
      icon: gift,
      title: "Reward System",
      description: "Stay motivated with built-in rewards for completed tasks.",
    },
    {
      id: "cross-platform-sync",
      icon: electric,
      title: "Cross-Platform Sync",
      description: "Sync your progress across devices effortlessly.",
    },
  ];

  return (
    <section
      className={`${getDarkModeClass(
        "bg-black text-white",
        "bg-white text-black"
      )} px-4 md:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="top flex flex-col md:flex-row pt-5">
          <div className="flex flex-col">
            <div
              className={`inline-flex items-center w-fit rounded-full border px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm ${getDarkModeClass(
                "border-gray-700",
                "border-gray-300"
              )}`}
            >
              <span
                className={`mr-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold ${getDarkModeClass(
                  "text-black",
                  "text-gray-800"
                )}`}
              >
                Our Features
              </span>
              <span>made for your convenience</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight min-w-0 flex-shrink-0">
              Optimize Your Time, Maximize Your Focus.
            </h1>
          </div>
          <div className="flex items-center">
            <p
              className={`${getDarkModeClass(
                "text-[#37A52D]",
                "text-green-700"
              )}`}
            >
              Stay in control of your productivity with powerful tools designed
              for deep focus, seamless workflow, and smarter time management.
            </p>
          </div>
        </div>
        <div
          className={`${getDarkModeClass(
            "bg-black text-white",
            "bg-white text-black"
          )} py-12 px-4 md:px-8 relative overflow-hidden`}
        >
          <div className="absolute top-1/4 left-12 w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
          <div className="absolute bottom-1/3 left-24 w-2 h-2 rounded-full bg-green-500 opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-green-500 opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 rounded-full bg-green-500 opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-green-500 opacity-10"></div>

          <div className="content flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            <ul className="flex flex-wrap gap-8 lg:w-1/2">
              {features.map((feature) => (
                <FeatureItem
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  isDarkMode={isDarkMode}
                />
              ))}
            </ul>
            <div className="lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0 relative">
              <Image
                src={phone}
                alt="phone"
                width={1200}
                height={1000}
                className="object-contain z-10 scale-125 lg:scale-150 xl:scale-[1.75]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
