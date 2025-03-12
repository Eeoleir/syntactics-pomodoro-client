import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import React, { useEffect, useRef, useState } from "react";
import { Rajdhani } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn, formatTime, generateColor } from "@/lib/utils";
import { Mode, useCycleStore } from "@/app/stores/cycleStore";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editTaskCompletedCycleStatus,
  finishFirstTask,
  Task,
} from "@/lib/task-queries";
import { toast } from "sonner";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import {
  changeTimerStatusRequest,
  createTimerRequest,
  getOngoingTimerRequest,
} from "@/lib/time-queries";
import { Cone } from "lucide-react";
import { useTaskStore } from "@/app/stores/taskStore";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

interface CircularTimerProps {
  isDarkMode: boolean;
}

export default function CircularTimer({ isDarkMode }: CircularTimerProps) {
  const translations = useTranslations("components.timer");
  const cycleDone = false; // dummy value for cycleDone (cyclee is done if (allTasks === completed))

  const {
    currentMode,
    durations,
    timeLeft,
    setTimeLeft,
    timerPaused,
  } = useCycleStore();

  // timer logic and behavior vars
  const intervalRef = useRef<NodeJS.Timeout>(null);
  const [prevTime, setPrevTime] = useState("");

  // time countdown
  useEffect(() => {
    setPrevTime(formatTime(timeLeft));

    if (timerPaused || cycleDone) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (!timerPaused && !cycleDone) {
        setTimeLeft(timeLeft > 0 ? timeLeft - 1 : timeLeft);
      }
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerPaused, timeLeft]);

  // timer logic & behaviors
  useEffect(() => {
    if (timeLeft === 0) {
      // logic here
    }
  }, [timeLeft]);

  // on mode update, update duration
  useEffect(() => {
    setTimeLeft(durations[currentMode]);
  }, [currentMode, durations]);

  const circProgressBarStyles = buildStyles({
    pathTransition: "stroke-dashoffset 0.15s ease-out 0s",
    pathColor: cycleDone ? "#f4f4f5" : generateColor(currentMode),
    trailColor: isDarkMode ? "#27272a" : "#f4f4f5",
    strokeLinecap: "round"
  })

  // handles blur timer and show controls
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  }
  const handleMouseOut = () => {
    setIsHovering(false);
  }

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className="container w-full flex flex-row justify-center max-h-72 px-5 space-x-5"
    >
      <div className={`container w-6/12 flex justify-center py-2`}>
        <div className={`min-w-[250px] ${
          (isHovering || timerPaused) && !cycleDone
            ? "blur-sm opacity-75"
            : ""
          } transition duration-200`}>
            <CircularProgressbarWithChildren
              strokeWidth={6.5}
              value={timeLeft}
              maxValue={durations[currentMode]}
              styles={circProgressBarStyles}
            >
              <TimerTickerAnim
              prev={prevTime}
              current={formatTime(timeLeft)}
              seconds={timeLeft}
              textColor={`${
                isDarkMode
                  ? cycleDone
                    ? "text-[#4f4f46]"
                    : "text-white"
                  : cycleDone
                    ? "text-[#d4d4d8]"
                    : "text-[#52525b]"
                }`}
              />
            </CircularProgressbarWithChildren>
        </div>
        {(isHovering || timerPaused) && !cycleDone && (
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
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

const TimerControls = ({
  initialTime,
  isDarkMode,
} : {
  initialTime: number;
  isDarkMode: boolean;
}) => {
  const {
    timerPaused,
    controlTimerPause,
    toNextMode,
    currentMode,
    currentCycleQueue,
    setTimeLeft,
    durations,
    setCurrentTimerId,
    setCyclesFromLongbreak
  } = useCycleStore();

  const {
    activeTask
  } = useTaskStore();

  // <-- mutations here
  // <-- patch timer status
  const changeTimerStatusMutation = useMutation({
    mutationFn: ({
      status,
      timer_id,
      time_remaining,
    }: {
      status: string;
      timer_id: number;
      time_remaining: number;
    }) => changeTimerStatusRequest(status, timer_id, time_remaining),
    onSuccess: () => {},
    onError: (error) => {
      console.error("Timer pause error:", error);
    },
  });
  // <-- create a new timer session
  const createTimerMutation = useMutation({
    mutationFn: ({
      task_id,
      session_type,
      duration,
    }: {
      task_id: number;
      session_type: string;
      duration: number;
    }) => createTimerRequest(task_id, session_type, duration),
    onSuccess: (response) => {
      setCurrentTimerId(response.data.id);
      // console.log("Timer response create:", response);
    },
    onError: (error) => {
      toast.error("Failed to play timer");
      console.error("Timer play error:", error);
    },
  });
  // <-- get ongoing timer (if any)
  const getOngoingTimerMutation = useMutation({
    mutationFn: () => getOngoingTimerRequest(),
    onSuccess: (response) => {
      setCurrentTimerId(response.data.id);
    },
  });

  // controls logic
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // <-- handle pause click
  const togglePause = () => {
    controlTimerPause();
  }
  useEffect(() => {
    if (!activeTask) {
      console.log(`task store active task --> ${activeTask}`);
      return;
    }
    if (timerPaused) {

    } else {
      getOngoingTimerMutation.mutate(undefined, {
        onSuccess: (response) => {
          if (response.data) {
            const taskId = response.data.task.id;
            if (taskId !== activeTask?.id) {
              const mutationVars = {
                task_id: activeTask.id,
                session_type: currentMode,
                duration: durations[currentMode]
              }
              createTimerMutation.mutate(
                mutationVars,
                {
                  onSuccess: (response) => {
                    setTimeLeft(response.data.time_remaining ?? response.data.duration);
                    setCyclesFromLongbreak(4); //TODO: dummy palang ni di pa ko sure
                  }
                }
              )
            } else {
              setCurrentTimerId(response.data.id);
              setTimeLeft(response.data.session_type);
            }
          } else {
            const mutationVars = {
              task_id: activeTask.id,
              session_type: currentMode,
              duration: durations[currentMode]
            }
            createTimerMutation.mutate(
              mutationVars,
              {
                onSuccess: (response) => {
                  setCurrentTimerId(response.data.id);
                  setTimeLeft(response.data.time_remaining ?? response.data.duration);
                  setCyclesFromLongbreak(4);
                }
              }
            )
          }
        }
      })
    }
  }, [timerPaused]);
  // <-- handle click skip
  const handleSkipCycle = () => {
    toNextMode();
    controlTimerPause(true);
  }
  // <-- handle reset
  const handleReset = () => {
    setTimeLeft(durations[currentMode]);
    controlTimerPause(true);
  }

  const secondaryBtnLayout = "w-[56px] h-[56px] shadow-none";
  const secondaryBtnStyles = `${
    isDarkMode
      ? "bg-[#3f3f46] hover:bg-[#2e2e33]"
      : "bg-[#f4f4f5] hover:bg-[#dedee0]"
  }`;

  const primaryBtnLayout = "w-[72px] h-[72px]";
  const primaryButtonStyle = `${
    isDarkMode
      ? "bg-[#52525b] hover:bg-[#393940]"
      : "bg-[#e4e4e7] hover:bg-[#cdcdd1]"
  }`;

  return (
    <div className={cn("container w-full h-64 blurred-background flex items-end justify-center")}>
      <div className="flex flex-row justify-center items-center space-x-3">
        {/* --- reset time --- */}
        <Button
          onClick={handleReset}
          className={`${secondaryBtnLayout} ${secondaryBtnStyles}`}>
          <Image
            src={`/timer_control_icons/restart.svg`}
            alt={"?"}
            width={25}
            height={25}
            className="-mt-[2px]"
          />
        </Button>

        {/* --- pause / start timer --- */}
        <Button
          className={`${primaryButtonStyle} ${primaryBtnLayout}`}
          onClick={togglePause}
          disabled={isButtonDisabled}
        >
          <Image
            src={`/timer_control_icons/${
              timerPaused ? "start" : "pause"
            }.svg`}
            alt={"?"}
            width={33}
            height={39}
            className="-mt-[2px]"
          />
        </Button>

        {/* --- proceed to next cycle  --- */}
        <Button
          className={`${secondaryBtnStyles} ${secondaryBtnLayout}`}
          onClick={handleSkipCycle}
          disabled={isButtonDisabled}
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
}

const TimerTickerAnim = ({
  prev,
  current,
  seconds,
  textColor
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
            fill: "forwards"
          }
        );
      }
    })
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
}

const OnFinishedCycleButton = ({
  isDarkMode
} : {
  isDarkMode: boolean;
}) => {
  const modeTranslations = useTranslations("components.mode-badges");
  const timerTranslations = useTranslations("components.timer");

  return (
    <Button
      className={`text-[18px] font-semibold py-[30px] shadow-none ${
        isDarkMode ? "bg-[#84cc16] text-white" : "bg-[#84cc16] text-black"
      }`}
      onClick={() => {}}
    >
      {timerTranslations("cycle-finish.buttons.start-focus.text")}{" "}
      {modeTranslations("focus.title")}
    </Button>
  );
}
