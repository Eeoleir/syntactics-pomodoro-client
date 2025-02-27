"use client"; // Ensure this runs on the client side
import React, { useEffect } from "react";
import "animate.css";
import PomodoroTimerCard from "@/components/custom/TimerCard";
import TaskList from "@/components/custom/tasklist/Tasklist";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#pomodoro-timer-card",
        popover: {
          title: "Pomodoro Timer",
          description:
            "This is your Pomodoro Timer. Use it to stay focused! Track the time remaining in your session and manage breaks effectively.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: ".long-break-button",
        popover: {
          title: "Break Option",
          description:
            "Feeling overwhelmed? Click here to take a short or long break and recharge before your next session.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#task-list",
        popover: {
          title: "Task List",
          description:
            "Here you can manage your tasks while using the timer. Add new tasks, edit existing ones, and delete completed tasks.",
          side: "top",
          align: "start",
        },
      },
      {
        element: "#add-task-button",
        popover: {
          title: "Add New Task",
          description:
            "Click here to add a new task to your list. Organize your work efficiently!",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#burger-menu-icon",
        popover: {
          title: "Task Options",
          description:
            "Click this menu icon to proceed and to reveal options like edit and delete.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#edit-task-button",
        popover: {
          title: "Edit Task",
          description:
            "Need to make changes? Click on a task to edit its details and update your plan.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#delete-task-button",
        popover: {
          title: "Delete Task",
          description:
            "Finished or no longer needed? Remove tasks from your list with this option.",
          side: "bottom",
          align: "start",
        },
      },
      {
        popover: {
          title: "You're All Set!",
          description:
            "Now you're ready to maximize your productivity with the Pomodoro Timer and Task List. Happy working!",
        },
      },
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
    <div className="min-w-screen min-h-screen bg-[#FAFAFA] text-black">
      <div className="p-10 w-full">
        <div className="flex items-center justify-between">
          <div id="pomodoro-timer-card">
            <h1 className="font-extrabold text-5xl">Pomodoro</h1>
            <p className="text-[#71717A] font-medium text-xl">
              Manage your time in a magical way!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={howToUseButton}>How to use</Button>
            <img
              src="/SunDim.svg"
              alt="lightmode"
              className="p-2 bg-[#F4F4F5] rounded-[4px]"
            />

            <img
              src="/Translate.svg"
              alt="translate"
              className="p-2 bg-[#F4F4F5] rounded-[4px]"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row mt-12 border-[#E4E4E7] gap-9">
          <div className="xl:w-3/6 2xl:w-5/12 lg:w-full">
            <PomodoroTimerCard />
          </div>
          <div className="flex flex-row xl:w-3/6 2xl:w-7/12 lg:w-full w-full border border-[#E4E4E7] rounded-xl">
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
