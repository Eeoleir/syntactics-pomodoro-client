import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ModeContext, Modes } from "@/app/context/ModeContext";
import { useContext, useEffect, useRef, useState} from "react";
import { create } from "zustand";

import { Rajdhani } from "next/font/google";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

export default function CircularTimer() {
  // mode context for the color of the timer
  const { mode, setMode } = useContext(ModeContext);

  const mockTime = 300;

  const [time, setTime] = useState(mockTime);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const generateColor = (mode: string) => {
    let color = "#84cc16"
    if (mode === Modes.LONG_BREAK) {
      color = "#06b6d4";
    } else if (mode === Modes.SHORT_BREAK) {
      color = "#f59e0b";
    }
    return color;
  };

  const styles = buildStyles({
    textColor: "#fff",
    pathColor: generateColor(mode),
    trailColor: "#27272a",
    textSize: "24px",
    strokeLinecap: "round",
  });

  const formatTime = (t: number) => {
      const hours = Math.floor((t / 60) / 60);

      const hoursStr = Math.floor((t / 60) / 60)
          .toString()
          .padStart(2, "0");
      const minutesStr = Math.floor((t / 60) % 60)
          .toString()
          .padStart(2, "0");
      const secondsStr = (t % 60)
          .toString()
          .padStart(2, "0");

      const timeStr = `
          ${hours > 0 ? `${hoursStr}:` : ''}${minutesStr}:${secondsStr}`;

      return timeStr;
  };

  return (
    <div className="w-[250px]">
      <CircularProgressbarWithChildren strokeWidth={6} value={time} maxValue={mockTime} styles={styles}>
        <h3 className={`${rajdhani.className} text-white text-[68px]`}>
          {formatTime(time)}
        </h3>
      </CircularProgressbarWithChildren>
    </div>
  );
}
