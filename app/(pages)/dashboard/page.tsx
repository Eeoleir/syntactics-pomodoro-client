"use client";

import React, { useEffect, useState } from "react";
import "animate.css";
import PomodoroTimerCard from "@/components/custom/TimerCard";
import TaskList from "@/components/custom/tasklist/Tasklist";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./AvatarDropdown";
import useAuthStore from "@/app/stores/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { editDarkMode } from "@/lib/preference-queries";
import { useProfileStore } from "@/app/stores/profileStore";
import LocaleInitializer, {
  locales,
  useLocaleStore,
} from "@/app/stores/localeStore";
import { Locale } from "@/next-intl-services/config";

const Dashboard = () => {
  const router = useRouter();
  const pageTranslations = useTranslations("dashboard");
  const { currentLocale, setCurrentLocale } = useLocaleStore();
  const { settings, setSettings, userId } = usePomodoroStore();
  const { profile } = useProfileStore();

  const [isDarkMode, setIsDarkMode] = useState(settings.is_dark_mode);

  useEffect(() => {
    setIsDarkMode(settings.is_dark_mode);
  }, [settings.is_dark_mode]);

  const darkModeMutation = useMutation({
    mutationFn: (params: { id: number; is_dark_mode: number }) =>
      editDarkMode(params.id, params.is_dark_mode),
    onSuccess: () => {
      toast.success("Theme preference updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update theme preference");

      setIsDarkMode(!isDarkMode);
      setSettings({ is_dark_mode: !isDarkMode });
    },
  });


  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setSettings({ is_dark_mode: newDarkMode });

    if (userId) {
      darkModeMutation.mutate({
        id: userId,
        is_dark_mode: newDarkMode ? 1 : 0,
      });
    } else {
      console.error("No user ID available to update dark mode");
    }
  };

  const guideTranslations = useTranslations("contextual-guide");
  const driverObj = driver({
    showProgress: true,
    steps: [

    ],
  });

  useEffect(() => {
    const firstTimeUser = JSON.parse(
      localStorage.getItem("firstTimeUser") ?? "true"
    );
    if (firstTimeUser) {
      driverObj.drive();
      localStorage.setItem("firstTimeUser", JSON.stringify(false));
    }
  }, [driverObj]);

  const howToUseButton = () => {
    driverObj.drive();
  };

  return (
    <div
      className={`min-w-screen min-h-screen ${
        isDarkMode ? "bg-[#18181B] text-[#FAFAFA]" : "bg-[#FAFAFA] text-black"
      } overflow-y-hidden`}
    >
      <LocaleInitializer />
      <div className="p-10 w-full">
        <div className="flex flex-end items-center justify-between md:flex-row md:mt-4 flex-col">
          <div id="pomodoro-timer-card" className="flex items-center">
            <img src="/pomoLogo.svg" alt="pomoLogo" />
            <div>
              <h1
                className={`font-extrabold text-4xl ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {pageTranslations("page-title")}
              </h1>
              <p className="text-[#71717A] font-medium text-xl">
                {pageTranslations("page-subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={"outline"}
              onClick={howToUseButton}
              className={`${
                isDarkMode
                  ? "bg-[#27272A] text-[#A1A1AA] hover:bg-[#3f3f46]"
                  : "bg-[#F4F4F5] text-[#52525B] hover:bg-gray-200"
              }`}
            >
              {guideTranslations("buttons.start-guide")}
            </Button>
            <Button
              onClick={toggleDarkMode}
              className={`${
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

            <Select
              value={currentLocale}
              onValueChange={(value: Locale) => {
                setCurrentLocale(value);
              }}
            >
              <SelectTrigger>
                <div
                  className={`${
                    isDarkMode
                      ? "bg-[#27272A] hover:bg-[#3f3f46]"
                      : "bg-[#F4F4F5] hover:bg-gray-200"
                  } h-8 w-8 flex justify-center items-center p-0 rounded-md`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 14 13"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.9469 12.2762L10.4469 5.27625C10.4053 5.19321 10.3415 5.12338 10.2625 5.07457C10.1835 5.02576 10.0925 4.99991 9.99969 4.99991C9.90684 4.99991 9.81583 5.02576 9.73685 5.07457C9.65786 5.12338 9.59403 5.19321 9.5525 5.27625L8.19563 7.99063C7.13206 7.93082 6.10875 7.56344 5.25 6.93313C6.25755 5.85716 6.86803 4.46976 6.98063 3H8.5C8.63261 3 8.75979 2.94732 8.85355 2.85355C8.94732 2.75979 9 2.63261 9 2.5C9 2.36739 8.94732 2.24021 8.85355 2.14645C8.75979 2.05268 8.63261 2 8.5 2H5V1C5 0.867392 4.94732 0.740215 4.85355 0.646447C4.75979 0.552678 4.63261 0.5 4.5 0.5C4.36739 0.5 4.24021 0.552678 4.14645 0.646447C4.05268 0.740215 4 0.867392 4 1V2H0.5C0.367392 2 0.240215 2.05268 0.146447 2.14645C0.0526784 2.24021 0 2.36739 0 2.5C0 2.63261 0.0526784 2.75979 0.146447 2.85355C0.240215 2.94732 0.367392 3 0.5 3H5.97687C5.86551 4.22541 5.34535 5.37778 4.5 6.27187C3.97322 5.71604 3.56871 5.05604 3.3125 4.33437C3.29143 4.27141 3.25804 4.21327 3.21426 4.16335C3.17048 4.11343 3.1172 4.07273 3.05753 4.04363C2.99785 4.01452 2.93298 3.99759 2.86669 3.99383C2.8004 3.99006 2.73402 3.99954 2.67144 4.0217C2.60885 4.04386 2.5513 4.07827 2.50216 4.12291C2.45301 4.16755 2.41324 4.22154 2.38518 4.28171C2.35712 4.34189 2.34133 4.40705 2.33872 4.47339C2.33612 4.53974 2.34675 4.60593 2.37 4.66813C2.66829 5.51179 3.13817 6.28449 3.75 6.9375C2.80798 7.62974 1.66902 8.00209 0.5 8C0.367392 8 0.240215 8.05268 0.146447 8.14645C0.0526784 8.24021 0 8.36739 0 8.5C0 8.63261 0.0526784 8.75979 0.146447 8.85355C0.240215 8.94732 0.367392 9 0.5 9C1.95037 9.00161 3.35916 8.51558 4.5 7.62C5.43098 8.34742 6.54235 8.80782 7.715 8.95187L6.0525 12.2762C5.99316 12.3949 5.98336 12.5322 6.02526 12.658C6.06717 12.7838 6.15734 12.8878 6.27594 12.9472C6.39454 13.0065 6.53186 13.0163 6.65768 12.9744C6.78351 12.9325 6.88753 12.8424 6.94688 12.7238L7.80875 11H12.1906L13.0525 12.7238C13.0941 12.8068 13.158 12.8767 13.237 12.9255C13.316 12.9743 13.4071 13.0001 13.5 13C13.5852 13 13.669 12.9781 13.7434 12.9366C13.8178 12.8951 13.8804 12.8352 13.9252 12.7627C13.9699 12.6902 13.9954 12.6074 13.9992 12.5223C14.003 12.4372 13.985 12.3525 13.9469 12.2762ZM8.30875 10L10 6.61812L11.6906 10H8.30875Z"
                      fill={isDarkMode ? "white" : "#71717A"}
                    />
                  </svg>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={locales.ENGLISH}>EN (English)</SelectItem>
                <SelectItem value={locales.PORTUGUESE}>
                  PT (Português)
                </SelectItem>
                <SelectItem value={locales.JAPANESE}>JA (日本語)</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                if (value === "logout") {
                  useAuthStore.getState().logout();
                  toast.success("Logout successfully!");
                  router.push("/login");
                }
                if (value === "settings") {
                  router.push("/user-settings");
                }
              }}
            >
              <SelectTrigger className="border-none focus:ring-0 focus:outline-none">
                <Avatar>
                  <AvatarImage
                    src={
                      profile?.profile_photo ?? "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>{profile?.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="settings">
                  {pageTranslations("buttons.settings.text")}
                </SelectItem>
                <SelectItem value="logout">
                  {pageTranslations("buttons.logout.text")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row mt-12 gap-9">
          <div className="xl:w-3/6 2xl:w-5/12 lg:w-full">
            <PomodoroTimerCard />
          </div>
          <div
            className={`flex flex-row xl:w-3/6 2xl:w-7/12 lg:w-full w-full border ${
              isDarkMode ? "border-[#27272A]" : "border-[#E4E4E7]"
            } rounded-xl`}
          >
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
