import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ModeContext, Modes } from "@/app/context/ModeContext";
import { useContext, useEffect, useRef, useState} from "react";
import { create } from "zustand";

import { Rajdhani } from "next/font/google";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import Image from "next/image";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

export default function CircularTimer() {
  // mode context for the color of the timer
  const { mode, setMode } = useContext(ModeContext);

  const mockTime = 300;
  const [ time, setTime ] = useState(mockTime);

  // NOTE: initial value should be passed from settings
  // (auto start next session = false then true & vice versa)
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setTime((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const generateColor = (mode: string) => {
    let color = "#ffffff";
    switch (mode) {
      case Modes.FOCUS: {
        color = "#84cc16";
        break;
      }
      case Modes.LONG_BREAK: {
        color = "#06b6d4";
        break;
      }
      case Modes.SHORT_BREAK: {
        color = "#f59e0b";
        break;
      }
    }
    return color;
  };

  const styles = buildStyles({
    pathColor: generateColor(mode),
    trailColor: "#27272a",
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

  // on hover logic
  const [ isHovering, setIsHovering ] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseOver = () => { setIsHovering(true); };
  const handleMouseOut = () => { setIsHovering(false); };

  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className="container w-full flex flex-row justify-center">
      <div className={`w-[250px] ${isHovering ? 'hover-blur' : ''} hover-blur-out`}>
        <CircularProgressbarWithChildren strokeWidth={6.5} value={time} maxValue={mockTime} styles={styles}>
          <h3 className={`${rajdhani.className} text-white ${time > 3600 ? 'text-[45px]' : 'text-[64px]'}`}>
            {formatTime(time)}
          </h3>
        </CircularProgressbarWithChildren>
      </div>
      {isHovering && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95}}
            animate={{ opacity: 1, scale: 1}}
            exit={{ opacity: 0, scale: 0.95}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute w-2/6 flex justify-center"
          >
            <TimerControls />
          </motion.div>
        </AnimatePresence>
      )}
      <style jsx>{`
        .hover-blur {
          filter: blur(5.5px);
          opacity: 0.4;
        }
        .hover-blur-out {
          transition: opacity 0.20s ease-out, filter 0.20s ease-out;
        }
      `}</style>
    </div>
  );
}

function TimerControls() {
  const containerStyles = `
    container
    w-full
    h-64
    blurred-background
    flex
    items-end
    justify-center
    `;

  const buttonStyles = `
    bg-[#3f3f46]
    hover:bg-[#2e2e33]
    w-[56px]
    h-[56px]
    `;

  const primaryButtonStyle = `
    bg-[#52525b]
    hover:bg-[#393940]
    w-[72px]
    h-[72px]
    `;

  return (
    <div className={containerStyles}>
      <div className="flex flex-row justify-center items-center space-x-3">
        <Button className={`${buttonStyles} `}>
          <Image src={`/timer_control_icons/restart.svg`} alt={'?'} width={25} height={25} className="-mt-[2px]"/>
        </Button>
        <Button className={`${primaryButtonStyle} `}>
          <Image src={`/timer_control_icons/start.svg`} alt={'?'} width={33} height={39} className="-mt-[2px]"/>
        </Button>
        <Button className={`${buttonStyles} `}>
          <Image src={`/timer_control_icons/next_session.svg`} alt={'?'} width={25} height={25} className="-mt-[2px]"/>
        </Button>
      </div>
    </div>
  );
}
