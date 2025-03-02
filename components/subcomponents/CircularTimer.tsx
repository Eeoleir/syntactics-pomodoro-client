import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import { useEffect, useRef, useState } from "react";

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

export default function CircularTimer() {
  // DUMMY STATE FOR CYCLE DONE
  const [cycleDone, setCycleDone] = useState(false);
  const [mockTaskCountdown, setMockTaskCountDown] = useState(4);

  // mode context for the color of the timer
  const {
    currentMode,
    durations,
    setTimeLeft,
    nextMode,
    activateNextMode,
    isTimerPaused,
    setIsPaused,
  } = useCycleStore();

  // countdown state variable
  const [time, setTime] = useState(durations[currentMode]);
  const intervalRef = useRef<NodeJS.Timeout>(null); // prevents re-renders, save resource

  // important for countdown animation
  const [prevTime, setPrevTime] = useState("");

  useEffect(() => {
    setPrevTime(formatTime(time));
    intervalRef.current = setInterval(() => {
      if (!isTimerPaused && !cycleDone) {
        setTime((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }, 1000);

    if (time === 0) {
      // < -------------- MOCK CONDITION FOR TESTING --------------> //
      if (mockTaskCountdown === 0) {
        setCycleDone(true);
      } else {
        if (currentMode === Mode.FOCUS) {
          setMockTaskCountDown(mockTaskCountdown - 1);
        }
      }

      if (!cycleDone && autoStart) {
        activateNextMode();
        setTimeLeft(nextMode, durations[nextMode]);
        setTime(durations[nextMode]);
      } else {
        setIsPaused(true);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    time,
    isTimerPaused,
    activateNextMode,
    durations,
    nextMode,
    setTimeLeft,
    prevTime,
    mockTaskCountdown,
    currentMode,
    cycleDone,
  ]);

  const styles = buildStyles({
    pathTransition: "stroke-dashoffset 0.15s ease-out 0s",
    pathColor: !cycleDone ? generateColor(currentMode) : "#f4f4f5",
    trailColor: darkMode ? "#27272a" : "#f4f4f5",
    strokeLinecap: "round",
  });

  // on hover logic
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };
  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="container w-full flex flex-row justify-center max-h-72 px-5 space-x-5"
    >
      <div className={`container w-6/12 flex justify-center py-2`}>
        <div
          className={`min-w-[250px] ${
            (isHovering || isTimerPaused) && !cycleDone
              ? "blur-sm opacity-75"
              : ""
          } transition duration-200`}
        >
          <CircularProgressbarWithChildren
            strokeWidth={6.5}
            value={time}
            maxValue={durations[currentMode]}
            styles={styles}
          >
            <TimeTickerAnim
              prev={prevTime}
              current={formatTime(time)}
              seconds={time}
              textColor={`${
                darkMode
                  ? cycleDone
                    ? "text-[#3f3f46]"
                    : "text-white"
                  : cycleDone
                  ? "text-[#d4d4d8]"
                  : "text-[#52525b]"
              }`}
            />
          </CircularProgressbarWithChildren>
        </div>
        {(isHovering || isTimerPaused) && !cycleDone && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, marginTop: 5 }}
              animate={{ opacity: 1, scale: 1, marginTop: 0 }}
              exit={{ opacity: 0, scale: 0.95, marginTop: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute w-2/6 flex justify-center p-6"
            >
              <TimerControls
                initialTime={durations[currentMode]}
                setTime={setTime}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      {cycleDone && (
        <div className="flex flex-col w-6/12 justify-start space-y-20">
          <div className="flex flex-col space-y-3">
            <h3
              className={`font-sans text-[32px] font-bold ${
                darkMode ? "text-[#f4f4f5]" : "text-[#3f3f46]"
              }`}
            >
              Congratulations! 🎉
            </h3>
            <h6
              className={`${
                darkMode ? "text-[#f4f4f5]" : "text-[#71717a]"
              } text-[18px]`}
            >
              You have reached the end of another cycle in this session!
            </h6>
          </div>
          <OnFinishedCycleButton />
        </div>
      )}
    </div>
  );
}

const TimeTickerAnim = ({
  prev,
  current,
  seconds,
  textColor,
}: {
  prev: string;
  current: string;
  seconds: number;
  textColor: string;
}) => {
  const digitRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    [...current].forEach((c, index) => {
      if (prev[index] !== c && digitRefs.current[index]) {
        const e = digitRefs.current[index];
        if (!e) return;

        e.animate(
          [
            { opacity: 0.2, transform: "translateY(-16px) rotateX(-200deg)" },
            { opacity: 1, transform: "translateY(4px) rotateX(0deg)" },
            { opacity: 1, transform: "translateY(0) rotateX(0)" },
          ],
          {
            duration: 200,
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }
    });
  }, [current, prev]);

  const textSizeClass = seconds > 3600 ? "text-[45px]" : "text-[64px]";
  const textColorClass = textColor;

  return (
    <h3 className={`flex ${textColorClass} ${textSizeClass}`}>
      {[...current].map((c, index) => (
        <span
          className={`${rajdhani.className}`}
          key={index}
          ref={(e) => {
            if (e) digitRefs.current[index] = e;
          }}
        >
          {c}
        </span>
      ))}
    </h3>
  );
};

const TimerControls = ({
  initialTime,
  setTime,
}: {
  initialTime: number;
  setTime: CallableFunction;
}) => {
  const { isTimerPaused, setIsPaused } = useCycleStore();

  const togglePause = () => {
    setIsPaused(!isTimerPaused);
  };

  const containerStyles = `container w-full h-64 blurred-background flex items-end justify-center`;

  const secondaryBtnLayout = "w-[56px] h-[56px] shadow-none";
  const secondaryBtnStyles = `${
    darkMode
      ? "bg-[#3f3f46] hover:bg-[#2e2e33]"
      : "bg-[#f4f4f5] hover:bg-[#dedee0]"
  }`;

  const primaryBtnLayout = "w-[72px] h-[72px]";
  const primaryButtonStyle = `${
    darkMode
      ? "bg-[#52525b] hover:bg-[#393940]"
      : "bg-[#e4e4e7] hover:bg-[#cdcdd1]"
  }`;

  const reset = () => {
    setTime(initialTime);
    setIsPaused(true);
  };

  return (
    <div className={containerStyles}>
      <div className="flex flex-row justify-center items-center space-x-3">
        {/* ---- reset time ----- */}
        <Button
          className={`${secondaryBtnStyles} ${secondaryBtnLayout}`}
          onClick={reset}
        >
          <Image
            src={`/timer_control_icons/restart.svg`}
            alt={"?"}
            width={25}
            height={25}
            className="-mt-[2px]"
          />
        </Button>
        {/* ---- pause / start timer ----- */}
        <Button
          className={`${primaryButtonStyle} ${primaryBtnLayout}`}
          onClick={togglePause}
        >
          <Image
            src={`/timer_control_icons/${
              isTimerPaused ? "start" : "pause"
            }.svg`}
            alt={"?"}
            width={33}
            height={39}
            className="-mt-[2px]"
          />
        </Button>
        {/* ---- proceed to next cycle  ----- */}
        <Button
          className={`${secondaryBtnStyles} ${secondaryBtnLayout}`}
          onClick={() => {}}
        >
          <Image
            src={`/timer_control_icons/next_session.svg`}
            alt={"?"}
            width={25}
            height={25}
            className="-mt-[2px]"
          />
        </Button>
      </div>
    </div>
  );
};

const OnFinishedCycleButton = (
  {
    /* nextMode */
  }
) => {
  return (
    <Button
      className="text-[18px] font-semibold py-[30px] bg-[#84cc16] shadow-none"
      onClick={() => {}}
    >
      Start: Focus
    </Button>
  );
};
