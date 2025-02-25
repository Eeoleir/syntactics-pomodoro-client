import { Button } from "@/components/ui/button";
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { CiClock2 } from "react-icons/ci";

export default function PomodoroSettings() {
  return (
    <div className="appSettings w-full lg:w-2/3 flex border-[1px] border-[#27272A] flex-col p-4 sm:p-6 md:p-[24px] gap-3 md:gap-[12px] rounded-[12px] text-[#A1A1AA]">
      <div className="top flex flex-row items-space-between w-full h-auto">
        <h2 className="text-[24px] font-[700]">Pomodoro Settings</h2>
        <Button className="pencil ml-auto bg-[#84CC16] p-3 rounded-[12px] h-fit text-white">
          <PiPencilSimpleLineDuotone className="size-4" />
        </Button>
      </div>
      <div className="timerSettings">
        <div className="timer flex flex-row items-center gap-2 text-[#52525B]">
          <CiClock2 className="size-[24px]" />
          <h3 className="text-[20px] font-[700]">Timer</h3>
        </div>
      </div>
    </div>
  );
}