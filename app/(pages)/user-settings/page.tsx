"use client";

import { IoArrowBack } from "react-icons/io5";
import PomodoroSettings from "@/components/custom/settings/pomodoro_settings";
import EditProfile from "@/components/custom/settings/edit_profile";
import { useRouter } from "next/navigation";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { useEffect, useState } from "react";
import { editDarkMode } from "@/lib/preference-queries";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Settings() {
  const router = useRouter();
  const { settings, setSettings, userId } = usePomodoroStore();
  const [isDarkMode, setIsDarkMode] = useState(settings.is_dark_mode);
  const pageTranslations = useTranslations('settings-page');

  useEffect(() => {
    setIsDarkMode(settings.is_dark_mode);
  }, [settings.is_dark_mode]);

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setSettings({ is_dark_mode: newDarkMode });

    if (userId) {
      try {
        await editDarkMode(userId, newDarkMode ? 1 : 0);
      } catch (error) {
        console.error("Failed to update dark mode:", error);

        setIsDarkMode(!newDarkMode);
        setSettings({ is_dark_mode: !newDarkMode });
      }
    } else {
      console.error("No user ID available to update dark mode");
    }
  };

  return (
    <main
      className={`w-full min-h-screen mx-auto ${
        isDarkMode ? "bg-[#18181B] text-[#FAFAFA]" : "bg-gray-100 text-black"
      } flex flex-col py-4 sm:py-8 md:py-[67px] px-4 sm:px-8 md:px-[160px] gap-6 sm:gap-8 md:gap-[48px]`}
    >
      <div
        className={`title flex flex-row items-center gap-2 w-full ${
          isDarkMode ? "text-zinc-200" : "text-black"
        }`}
      >
        <IoArrowBack
          onClick={() => router.back()}
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } size-6 sm:size-8 md:size-[44px] ${
            isDarkMode ? "" : "hover:text-gray-600"
          }`}
        />
        <h2
          className={`${
            isDarkMode ? "text-white" : "text-black"
          } text-xl sm:text-2xl md:text-[40px] font-semibold`}
        >
          {pageTranslations('page-title')}
        </h2>
        <Button
          onClick={toggleDarkMode}
          className={`ml-auto ${
            isDarkMode
              ? "bg-[#27272A] text-white hover:bg-[#3f3f46]"
              : "bg-[#F4F4F5] text-[#52525B] hover:bg-gray-200"
          } h-8 w-8 rounded-full`}
        >
          {isDarkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#71717A"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          )}
        </Button>
      </div>

      <div className="content flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-[36px]">
        <EditProfile />
        <PomodoroSettings />
      </div>
    </main>
  );
}
