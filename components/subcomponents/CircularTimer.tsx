import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { ModeContext, Modes } from "@/app/context/ModeContext";
import { useContext, useEffect, useRef, useState} from "react";
import { create } from "zustand";

import { Rajdhani } from "next/font/google";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatTime } from "@/lib/utils";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

const darkMode = false;

export default function CircularTimer() {
  // mode context for the color of the timer
  const { mode } = useContext(ModeContext);

  const mockTime = 300;
  const [ time, setTime ] = useState(mockTime);

  // timer logic
  // NOTE: initial value should be passed from settings
  // (auto start next session = false then true & vice versa)
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>(null);
  // timer mechanism
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
    let color = "#27272a";
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
    trailColor: darkMode ? "#27272a" : "#f4f4f5",
    strokeLinecap: "round",
  });

  // on hover logic
  const [ isHovering, setIsHovering ] = useState(false);
  const handleMouseOver = () => { setIsHovering(true); };
  const handleMouseOut = () => { setIsHovering(false); };

  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className="container w-full flex flex-row justify-center">
      <div className={`w-[250px] ${(isHovering || isPaused) ? 'blur-sm opacity-75' : ''} transition duration-200`}>
        <CircularProgressbarWithChildren strokeWidth={6.5} value={time} maxValue={mockTime} styles={styles}>
          <h3 className={`${rajdhani.className} text-${darkMode ? "white" : "[#52525b]"} ${time > 3600 ? 'text-[45px]' : 'text-[64px]'}`}>
            {formatTime(time)}
          </h3>
        </CircularProgressbarWithChildren>
      </div>
      {(isHovering || isPaused) && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, marginTop: 5}}
            animate={{ opacity: 1, scale: 1, marginTop: 0}}
            exit={{ opacity: 0, scale: 0.95, marginTop: 5}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute w-2/6 flex justify-center"
          >
            <TimerControls isPaused={isPaused} setPaused={setIsPaused} initialTime={mockTime} setTime={setTime}/>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

const TimerControls = ({ isPaused, setPaused, initialTime, setTime }: { isPaused: boolean, setPaused: CallableFunction, initialTime: number, setTime: CallableFunction }) => {
  const containerStyles = `container w-full h-64 blurred-background flex items-end justify-center`;

  const secondaryBtnLayout = "w-[56px] h-[56px]";
  const secondaryBtnStyles = `${
    darkMode
    ? "bg-[#3f3f46] hover:bg-[#2e2e33]"
    : "bg-[#e4e4e7] hover:bg-[#cfcfd4]"}`;

  const primaryBtnLayout = "w-[72px] h-[72px]";
  const primaryButtonStyle = `${
    darkMode
    ? "bg-[#52525b] hover:bg-[#393940]"
    : "bg-[#e4e4e7] hover:bg-[#cdcdd1]"}`;

  // control logic
  const togglePause = () => { setPaused(!isPaused); }
  const reset = () => { setTime(initialTime); setPaused(true) };

  return (
    <div className={containerStyles}>
      <div className="flex flex-row justify-center items-center space-x-3">
        {/* ---- reset time ----- */}
        <Button className={`${secondaryBtnStyles} ${secondaryBtnLayout}`} onClick={reset}>
          <Image src={`/timer_control_icons/restart.svg`} alt={'?'} width={25} height={25} className="-mt-[2px]"/>
        </Button>
        {/* ---- pause / start timer ----- */}
        <Button className={`${primaryButtonStyle} ${primaryBtnLayout}`} onClick={togglePause}>
          <Image src={`/timer_control_icons/${isPaused ? 'start' : 'pause'}.svg`} alt={'?'} width={33} height={39} className="-mt-[2px]"/>
        </Button>
        {/* ---- proceed to next cycle  ----- */}
        <Button className={`${secondaryBtnStyles} ${secondaryBtnLayout}`} onClick={() => {}}>
          <Image src={`/timer_control_icons/next_session.svg`} alt={'?'} width={25} height={25} className="-mt-[2px]"/>
        </Button>
      </div>
    </div>
  );
}
