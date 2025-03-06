"use client";

import { useEffect } from "react";
import Header from "@/components/subcomponents/header";
import Footer from "@/components/subcomponents/footer";
import { HeroSection } from "./(pages)/section/HeroSection";
import { IntroSection } from "./(pages)/section/IntroSection";
import { FeaturesSection } from "./(pages)/section/FeaturesSection";
import { DownloadSection } from "./(pages)/section/DownloadSection";
import { useDarkMode } from "@/components/custom/Toggle";

export default function Home() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const firstTimeUser = JSON.parse(
      localStorage.getItem("firstTimeUser") ?? "true"
    );
    if (firstTimeUser) {
      localStorage.setItem("firstTimeUser", JSON.stringify(false));
    }
  }, []);

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden ${
        isDarkMode ? "bg-[#18181B] text-[#FAFAFA]" : "bg-gray-100 text-black"
      }`}
    >
      <Header />
      <HeroSection isDarkMode={isDarkMode} />
      <IntroSection isDarkMode={isDarkMode} />
      <FeaturesSection isDarkMode={isDarkMode} />
      <DownloadSection isDarkMode={isDarkMode} />
      <Footer />
    </main>
  );
}
