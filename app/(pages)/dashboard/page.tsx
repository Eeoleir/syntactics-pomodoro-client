"use client"; // Ensure this runs on the client side
import React, { useEffect } from "react";
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
  SelectValue,
} from "./AvatarDropdown";
import useAuthStore from "@/app/stores/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const Dashboard = () => {
  const { setTheme } = useTheme();

  // translations
  const pageTranslations = useTranslations('dashboard');
  const toastTranslations = useTranslations('components.toasts')

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { settings, setSettings } = usePomodoroStore();

  const guideTranslations = useTranslations('contextual-guide');
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#pomodoro-timer-card",
        popover: {
          title: guideTranslations('pomodoro-timer.title'),
          description: guideTranslations('pomodoro-timer.description'),
          side: "bottom",
          align: "start",
        },
      },
      {
        element: ".long-break-button",
        popover: {
          title: guideTranslations('break-option.title'),
          description: guideTranslations('break-option.description')  ,
          side: "right",
          align: "start",
        },
      },
      {
        element: "#task-list",
        popover: {
          title: guideTranslations('task-list.title'),
          description: guideTranslations('task-list.description'),
          side: "top",
          align: "start",
        },
      },
      {
        element: "#add-task-button",
        popover: {
          title: guideTranslations('add-new-task.title'),
          description: guideTranslations('add-new-task.description'),
          side: "left",
          align: "start",
        },
      },
      {
        element: "#burger-menu-icon",
        popover: {
          title: guideTranslations('task-options.title'),
          description: guideTranslations('task-options.description'),
          side: "right",
          align: "start",
        },
      },
      {
        element: "#edit-task-button",
        popover: {
          title: guideTranslations('edit-task.title'),
          description: guideTranslations('edit-task.description'),
          side: "left",
          align: "start",
        },
      },
      {
        element: "#delete-task-button",
        popover: {
          title: guideTranslations('delete-task.title'),
          description: guideTranslations('delete-task.description'),
          side: "bottom",
          align: "start",
        },
      },
      {
        popover: {
          title: guideTranslations('all-set.title'),
          description: guideTranslations('all-set.description'),
        },
      },
    ],
  });
  const router = useRouter();

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

  React.useEffect(() => {
    setTheme(settings.is_dark_mode ? "dark" : "light");
  }, [settings.is_dark_mode, setTheme]);

  const toggleDarkMode = () => {
    const newDarkMode = !settings.is_dark_mode;
    setSettings({ is_dark_mode: newDarkMode });
    setTheme(newDarkMode ? "dark" : "light");
  };

  return (
    <div className="min-w-screen min-h-screen bg-[#FAFAFA] dark:bg-[#18181B] text-black">
      <div className="p-10 w-full">
        <div className="flex flex-end items-center justify-between md:flex-row md:mt-4 flex-col">
          <div id="pomodoro-timer-card" className="flex items-center">
            <img src="/pomoLogo.svg" alt="pomoLogo" />
            <div>
              <h1 className="font-extrabold text-4xl text-black dark:text-[#E4E4E7]">
                {pageTranslations('page-title')}
              </h1>
              <p className="text-[#71717A] font-medium text-xl">
                {pageTranslations('page-subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={"outline"}
              onClick={howToUseButton}
              className="dark:bg-[#18181B] text-[#52525B] dark:text-[#A1A1AA]"
            >
              {guideTranslations('buttons.start-guide')}
            </Button>
            <Button
              onClick={toggleDarkMode}
              className={`${
                settings.is_dark_mode === true
                  ? "bg-[#27272A]"
                  : "bg-[#F4F4F5] hover:bg-gray-200"
              } h-8 w-8`}
            >
              {settings.is_dark_mode === true ? (
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
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="settings">{pageTranslations('buttons.settings.text')}</SelectItem>
                <SelectItem value="logout">{pageTranslations('buttons.logout.text')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row mt-12 border-[#E4E4E7] gap-9">
          <div className="xl:w-3/6 2xl:w-5/12 lg:w-full">
            <PomodoroTimerCard />
          </div>
          <div className="flex flex-row xl:w-3/6 2xl:w-7/12 lg:w-full w-full border border-[#E4E4E7] dark:border-[#27272A] rounded-xl">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
