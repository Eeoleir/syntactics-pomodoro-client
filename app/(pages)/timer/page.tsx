"use client"

import PomodoroTimerCard from "@/components/custom/TimerCard";
import * as React from "react"

export default function TimerDevPage() {
  return (
    <div className="bg-[#18181b] h-[100vh] w-full flex justify-center items-center">
      <PomodoroTimerCard/>
    </div>
  );
}
