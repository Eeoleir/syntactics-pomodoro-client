import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import React, { useEffect, useRef, useState } from "react";
import { Rajdhani } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatTime, generateColor } from "@/lib/utils";
import { Mode, useCycleStore } from "@/app/stores/cycleStore";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finishFirstTask, Task } from "@/lib/task-queries";
import { toast } from "sonner";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { changeTimerStatusRequest, createTimerRequest } from "@/lib/time-queries";
import { Cone } from "lucide-react";
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["700"] });

interface CircularTimerProps {
  isDarkMode: boolean;
}

export default function CircularTimer({ isDarkMode }: CircularTimerProps) {
  const [cycleDone, setCycleDone] = useState(false);
  const [mockTaskCountdown, setMockTaskCountDown] = useState(4);
  const timerTranslations = useTranslations("components.timer");

  const {
    currentMode,
    durations,
    setTimeLeft,
    nextMode,
    activateNextMode,
    isTimerPaused,
    setIsPaused,
    currentTimeLeft,
    longBreakIntervalCounter,
    longBreakInterval,
  } = useCycleStore();

  const [internalMode, setInternalMode] = useState(currentMode);

  const intervalRef = useRef<NodeJS.Timeout>(null);

  // important for countdown animation
  const [prevTime, setPrevTime] = useState("");

  useEffect(() => {
    setPrevTime(formatTime(currentTimeLeft));

    intervalRef.current = setInterval(() => {
      if (!isTimerPaused && !cycleDone) {
        // Decrement time left
        setTimeLeft(currentMode, currentTimeLeft > 0 ? currentTimeLeft - 1 : 0);
      }
    }, 1000);

    // When timer reaches 0
    if (currentTimeLeft === 0) {
      // Determine if we should mark cycle as done
      const shouldMarkCycleDone =
        longBreakIntervalCounter + 1 === longBreakInterval &&
        currentMode === Mode.LONG_BREAK;

      if (shouldMarkCycleDone) {
        setCycleDone(true);
        setIsPaused(true);
      }
      // else {
      //   // Activate next mode and set its duration
      //   activateNextMode();
      //   setTimeLeft(nextMode, durations[nextMode]);
      // }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    currentTimeLeft,
    isTimerPaused,
    activateNextMode,
    durations,
    nextMode,
    setTimeLeft,
    currentMode,
    cycleDone,
    longBreakIntervalCounter,
    longBreakInterval,
  ]);

  const styles = buildStyles({
    pathTransition: "stroke-dashoffset 0.15s ease-out 0s",
    pathColor: !cycleDone ? generateColor(currentMode) : "#f4f4f5",
    trailColor: isDarkMode ? "#27272a" : "#f4f4f5", // Use isDarkMode for trail color
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
            value={currentTimeLeft}
            maxValue={durations[currentMode]}
            styles={styles}
          >
            <TimeTickerAnim
              prev={prevTime}
              current={formatTime(currentTimeLeft)}
              seconds={currentTimeLeft}
              textColor={`${
                isDarkMode
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
                setTime={(newTime: number) => setTimeLeft(currentMode, newTime)}
                isDarkMode={isDarkMode}
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
                isDarkMode ? "text-[#f4f4f5]" : "text-[#3f3f46]"
              }`}
            >
              {timerTranslations("cycle-finish.header")}
            </h3>
            <h6
              className={`${
                isDarkMode ? "text-[#f4f4f5]" : "text-[#71717a]"
              } text-[18px]`}
            >
              {timerTranslations("cycle-finish.message")}
            </h6>
          </div>
          <OnFinishedCycleButton isDarkMode={isDarkMode} />{" "}
          {/* Pass isDarkMode */}
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
  isDarkMode,
}: {
  initialTime: number;
  setTime: CallableFunction;
  isDarkMode: boolean; // Add isDarkMode prop
}) => {
  const {
    isTimerPaused,
    setIsPaused,
    activateNextMode,
    currentMode,
    nextMode,
    durations,
    setTimeLeft,
    timerId,
    setTimerId
  } = useCycleStore();

  const togglePause = () => {
    setIsPaused(!isTimerPaused);
  };

  const noAvailableTasks = useCycleStore((state) => state.noAvailableTasks);

  const containerStyles = `container w-full h-64 blurred-background flex items-end justify-center`;

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

  const reset = () => {
    setTime(initialTime);
    setIsPaused(true);
  };

  const queryClient = useQueryClient();

  const completeFirstListTask = useMutation({
    mutationFn: (taskId: number) => finishFirstTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((task) =>
          task.id === taskId ? { ...task, status: "completed" } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.warning("Failed to mark task as completed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const createTimerMutation = useMutation({
    mutationFn: ({
      task_id,
      session_type,
      duration,
    } : {
      task_id: number;
      session_type: string;
      duration: number;
    }) => createTimerRequest(task_id, session_type, duration),
    onSuccess: (response) => {
      setTimerId(response.data.id);
      toast.success("Timer play successfully");
      console.log("Timer response:", response);
    },
    onError: (error) => {
      toast.error("Failed to play timer");
      console.error("Timer play error:", error);
    },
  });

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
    onSuccess: () => {
      toast.success("Timer paused successfully");
    },
    onError: (error) => {
      console.error("Timer pause error:", error);
    },
  });

  const handleNextSession = () => {
    const tasks = queryClient.getQueryData<Task[]>(["tasks"]);
    const firstTask = tasks?.find((task) => task.status !== "completed");
    console.log(tasks);
    console.log(firstTask);

    let proceed = false;
    console.log(timerId)
    if (timerId) {
      changeTimerStatusMutation.mutate({
        status: "completed",
        timer_id: timerId,
        time_remaining: 0}, {
          onSuccess: (response) => {
            console.log('change timer stat');
            proceed = true;

            console.log(firstTask);
            if (!firstTask || !proceed) {
              return false;
            }

            activateNextMode();
            setIsPaused(true);

            createTimerMutation.mutate(
              {
                task_id: firstTask?.id,
                session_type: nextMode,
                duration: durations[nextMode]
              },
              {
                onSuccess: (response) => {
                  if (!response.data) {
                    console.log('on-skip --> request response returned without data')
                    return false;
                  }
                  console.log(`on skip --> ${response}`);
                  setTimerId(response.data.id);

                  let timeRemaining = response.data.time_remaining ?? response.data.duration;

                  console.log(response.data.session_type)
                  setIsPaused(false);
                }
              }
            )
          }
        })
    }


    if (firstTask && currentMode === Mode.FOCUS) {
      completeFirstListTask.mutate(firstTask.id, {
        onSuccess: () => {
          setTimeout(() => {
            if (usePomodoroStore.getState().settings.is_auto_start_breaks) {
              setIsPaused(true);
            } else {
              setIsPaused(false);
            };
          }, 1000)
        },
      });
    }
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
          disabled={noAvailableTasks}
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
          onClick={handleNextSession}
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

const OnFinishedCycleButton = ({
  isDarkMode,
}: {
  isDarkMode: boolean; // Add isDarkMode prop
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
};
