import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { useContext, useEffect, useRef, useState} from "react";

import { Rajdhani } from "next/font/google";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatTime, generateColor } from "@/lib/utils";
import { Mode, useCycleStore } from "@/app/stores/cycleStore";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

// DUMMY VALUES FOR FEATURES THAT ARE NOT YET IMPLEMENTED
const darkMode = false;
const autoStart = true; // from settings
const cycleDone = false; // is set to true when no more tasks are left

export default function CircularTimer() {

  // mode context for the color of the timer
  const {
    currentMode,
    durations,
    setTimeLeft,
    nextMode,
    activateNextMode
  } = useCycleStore();

  // countdown state variable
  const [ time, setTime ] = useState(durations[currentMode]);
  const [isPaused, setIsPaused] = useState(true); // intial value should be from settings (auto start next session = false then true & vice versa)
  const intervalRef = useRef<NodeJS.Timeout>(null); // prevents re-renders, save resource

  // important for countdown animation
  const [prevTime, setPrevTime] = useState('');

  useEffect(() => {
    setPrevTime(formatTime(time));
    console.log(`prevTime --> ${prevTime}`)
    intervalRef.current = setInterval(() => {
      if (!isPaused && !cycleDone) {
        setTime((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }, 1000);

    if (time === 0) {
      if (!cycleDone && autoStart) {
        activateNextMode();
        setTimeLeft(nextMode, durations[nextMode]);
        setTime(durations[nextMode]);
      } else {
        setIsPaused(true);
      }
    }

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) };

  }, [time, isPaused, activateNextMode, durations, nextMode, setTimeLeft, prevTime]);

  const styles = buildStyles({
    pathColor: !cycleDone ? generateColor(currentMode) : "#f4f4f5",
    trailColor: darkMode ? "#27272a" : "#f4f4f5",
    strokeLinecap: "round",
  });

  // on hover logic
  const [ isHovering, setIsHovering ] = useState(false);
  const handleMouseOver = () => { setIsHovering(true); };
  const handleMouseOut = () => { setIsHovering(false); };

  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} className="container w-full flex flex-row justify-center max-h-72 px-5">
      <div className={`container w-6/12 flex xl:justify-center justify-start py-2 ${(isHovering || isPaused) ? 'blur-sm opacity-75' : ''} transition duration-200`}>
        <div className="w-[250px]">
          <CircularProgressbarWithChildren strokeWidth={6.5} value={time} maxValue={durations[currentMode]} styles={styles}>
            <TimeTickerAnim prev={prevTime} current={formatTime(time)} seconds={time}/>
          </CircularProgressbarWithChildren>
        </div>
      </div>
      {(isHovering || isPaused) && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, marginTop: 5}}
            animate={{ opacity: 1, scale: 1, marginTop: 0}}
            exit={{ opacity: 0, scale: 0.95, marginTop: 5}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute w-2/6 flex justify-center p-6"
          >
            <TimerControls isPaused={isPaused} setPaused={setIsPaused} initialTime={durations[currentMode]} setTime={setTime}/>
          </motion.div>
        </AnimatePresence>
      )}
      { (cycleDone) &&  (
        <div className="flex flex-col w-6/12 justify-start space-y-20">
          <div className="flex flex-col space-y-3">
            <h3 className={`font-sans text-[32px] font-bold ${darkMode ? "text-[#f4f4f5]" : "text-[#3f3f46]"}`}>Congratulations! 🎉</h3>
            <h6 className={`${darkMode ? "text-[#f4f4f5]" : "text-[#71717a]"} text-[18px]`}>You have reached the end of another cycles in this session!</h6>
          </div>
          <OnFinishedCycleButton/>
        </div>
      )}
    </div>
  );
}

const TimeTickerAnim = ({ prev, current, seconds }: { prev: string, current: string, seconds: number }) => {
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    [...current].forEach((c, index) => {
      if (prev[index] !== c && digitRefs.current[index]) {
        const e = digitRefs.current[index];
        if (!e) return;

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

  const textSizeClass = seconds > 3600 ? "text-[45px]" : "text-[64px]";
  const textColorClass = darkMode ? "text-white" : "text-[#52525b]";

  return (
    <h3 className={`flex ${textColorClass} ${textSizeClass}`}>
      {[...current].map((c, index) => (
        <span
          className={`${rajdhani.className}`}
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

const OnFinishedCycleButton = ({ /* nextMode */ }) => {
  const { activateNextMode } = useCycleStore();

  return (
    <Button className="text-[18px] font-semibold py-[30px] bg-[#84cc16] shadow-none" onClick={activateNextMode}>
      Start: Focus
    </Button>
  );
}
