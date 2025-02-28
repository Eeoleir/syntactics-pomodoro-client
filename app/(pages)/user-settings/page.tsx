"use client";

import { IoArrowBack } from "react-icons/io5";
import PomodoroSettings from "@/components/custom/settings/pomodoro_settings";
import EditProfile from "@/components/custom/settings/edit_profile";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  return (
    <main className="w-full min-h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex flex-col py-4 sm:py-8 md:py-[67px] px-4 sm:px-8 md:px-[160px] gap-6 sm:gap-8 md:gap-[48px]">
      <div className="title flex flex-row items-center gap-2 w-full text-zinc-200">
        <IoArrowBack
          onClick={() => router.back()}
          className="text-white size-6 sm:size-8 md:size-[44px]"
        />
        <h2 className="text-white text-xl sm:text-2xl md:text-[40px] font-semibold">
          Settings
        </h2>
      </div>

      <div className="content flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-[36px]">
        <EditProfile />

        <PomodoroSettings />
      </div>
    </main>
  );
}
