"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import kamot from "@/public/hand2.png";
import Polka1 from "@/public/polkadots1.png";
import Polka2 from "@/public/polkadots2.png";

interface HeroSectionProps {
  readonly isDarkMode: boolean;
}

export function HeroSection({ isDarkMode }: HeroSectionProps) {
  const getDarkModeClass = (dark: string, light: string) =>
    isDarkMode ? dark : light;

  return (
    <section className="flex flex-col lg:flex-row w-full h-[100vh] pt-24 md:pt-32 lg:pt-40">
      <div className="flex items-end w-full lg:w-1/2 order-2 lg:order-1 lg:pr-[4vw] xl:pr-[8vw] mb-8 lg:mb-0">
        <div className="relative">
          <div className="absolute z-[-1] top-[0px] left-[90px]">
            <Image
              src={Polka1}
              alt="Polkadots"
              className="w-[281px] h-[351px]"
            />
          </div>
          <Image
            src={kamot}
            alt="PomoSync App Illustration"
            width={800}
            height={800}
            priority
            className="w-[800px] h-auto"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      <div className="relative flex items-center w-full lg:w-1/2 px-6 lg:px-0 order-1 lg:order-2 mb-10 pb-[100px] lg:mb-0">
        <Image
          src={Polka2}
          alt="Polkadots"
          className="w-[281px] h-[351px] absolute z-[-1] bottom-[10px] right-[-30px] opacity-0 md:opacity-100"
        />
        <div className="w-full lg:w-[90%] xl:w-[80%] 2xl:w-[70%] flex flex-col gap-4 md:gap-5">
          <div
            className={`inline-flex items-center w-fit rounded-full border px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm ${getDarkModeClass(
              "border-gray-700",
              "border-gray-300"
            )}`}
          >
            <span
              className={`inline-block px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-full ${getDarkModeClass(
                "bg-black text-white",
                "bg-gray-200 text-black"
              )}`}
            >
              New
            </span>
            <span className="ml-2">Your Productivity Companion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight min-w-0 flex-shrink-0">
            Master Your Time with the Ultimate Pomodoro Timer
          </h1>
          <p
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-light ${getDarkModeClass(
              "text-[#2A7523]",
              "text-green-700"
            )}`}
          >
            Escape the clutter and chaos—Whether you're tackling work, studying,
            or managing tasks, PomoSync helps you stay on track with focused
            work sessions and strategic breaks.
          </p>
          <div className="buttons flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 mt-2">
            <Button
              className={`font-bold text-base sm:text-lg md:text-xl py-4 px-5 md:p-6 rounded-2xl md:rounded-3xl border-[0.1em] border-[#84CC16] w-full sm:w-auto ${getDarkModeClass(
                "bg-[#3D4142] text-white",
                "bg-white text-black"
              )}`}
            >
              Explore Features
            </Button>
            <Button className="font-bold text-base sm:text-lg md:text-xl py-4 px-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#84CC16] text-white w-full sm:w-auto">
              Get App for free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
