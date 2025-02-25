import React from "react";

import "animate.css";
import PomodoroTimerCard from "@/components/custom/TimerCard";
import TaskList from "@/components/custom/tasklist/Tasklist";

const Dashboard = () => {
  return (
    <div className="min-w-screen min-h-screen bg-[#FAFAFA] text-black">
      <div className="p-10 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-5xl">Pomodoro</h1>
            <p className="text-[#71717A] font-medium text-xl">
              Manage your time in a magical way!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src="/SunDim.svg"
              alt="lightmode"
              className="p-2 bg-[#F4F4F5] rounded-[4px]"
            />
            <img
              src="/GithubLogo.svg"
              alt="githubLogo"
              className="p-2 bg-[#F4F4F5] rounded-[4px]"
            />
            <img
              src="/Translate.svg"
              alt="translate"
              className="p-2 bg-[#F4F4F5] rounded-[4px]"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row mt-12 border-[#E4E4E7] gap-9">
          <div className="flex flex-row w-full border border-[#E4E4E7]">
            <PomodoroTimerCard />
          </div>
          <div className="flex flex-row w-full border border-[#E4E4E7]">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
