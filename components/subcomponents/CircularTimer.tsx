import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { Modes, useMode, } from "@/app/context/ModeContext";
import { useContext, useEffect, useRef, useState} from "react";

import { Rajdhani } from "next/font/google";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatTime } from "@/lib/utils";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

const darkMode = false;

export default function CircularTimer() {
  // mode context for the color of the timer
  const { mode, setMode } = useMode();

  const mockTime = 120;
  const [ time, setTime ] = useState(mockTime);

  // timer logic
  // NOTE: initial value should be passed from settings
  // (auto start next session = false then true & vice versa)
  const [isPaused, setIsPaused] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  //
  const [current, setCurrentTime] = useState(formatTime(mockTime))
  const [prev, setPrevTime] = useState('');

  // timer mechanism
  useEffect(() => {
    setPrevTime((current));

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setTime((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }, 1000);

    setCurrentTime(formatTime(time));

    if (time === 0) {
      setIsPaused(true);
      setTime(mockTime);
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, time, current]);

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
          <TimeTickerAnim prev={prev} current={current} seconds={time}/>
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

const TimeTickerAnim = ({ prev, current, seconds }: { prev: string, current: string, seconds: number }) => {
  // Store references to each digit element
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Style constants
  const textSizeClass = seconds > 3600 ? "text-[45px]" : "text-[64px]";
  const textColorClass = darkMode ? "text-white" : "text-[#52525b]";

  // Use useEffect to handle animations only when necessary
  useEffect(() => {
    [...current].forEach((c, index) => {
      if (prev[index] !== c && digitRefs.current[index]) {
        // Get the current element
        const e = digitRefs.current[index];
        if (!e) return;

        // Create animation using the Web Animation API
        e.animate([
          { opacity: 0.2, transform: 'translateY(-16px) rotateX(-200deg)' },
          { opacity: 1, transform: 'translateY(4px) rotateX(0deg)' },
          { opacity: 1, transform: 'translateY(0) rotateX(0)' }
        ], {
          duration: 200,
          easing: 'ease-out',
          fill: 'forwards'
        });
      }
    });
  }, [current, prev]);

  return (
    <h3 className={`${rajdhani.className} flex ${textColorClass} ${textSizeClass}`}>
      {[...current].map((c, index) => (
        <span
          key={index}
          ref={e => {if (e) digitRefs.current[index] = e}}
        >
          {c}
        </span>
      ))}
    </h3>
  );
};

const TimerControls = ({ isPaused, setPaused, initialTime, setTime }: { isPaused: boolean, setPaused: CallableFunction, initialTime: number, setTime: CallableFunction }) => {
  const containerStyles = `container w-full h-64 blurred-background flex items-end justify-center`;

  const secondaryBtnLayout = "w-[56px] h-[56px] shadow-none";
  const secondaryBtnStyles = `${
    darkMode
    ? "bg-[#3f3f46] hover:bg-[#2e2e33]"
    : "bg-[#f4f4f5] hover:bg-[#dedee0]"}`;

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
