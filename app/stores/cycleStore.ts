import { create } from "zustand";
import { usePomodoroStore } from "./pomodoroStore";

// TIMER SESSION STATS : COMPLETED, PAUSED, ONGOING

export enum Mode {
  FOCUS = "focus",
  SHORT_BREAK = "short_break",
  LONG_BREAK = "long_break"
}

type TimerState = {
  timeLeft: number;
  timerPaused: boolean;
}

type TimerActions = {
  setTimeLeft: (t: number) => void;
  controlTimerPause: (b?: boolean) => void;
}

type CycleState = {
  durations: { [keys in Mode]: number };
  // interval vars
  currentCycleQueue: Mode[];
  currentMode: Mode;
  cyclesFromLongBreak: number;
  currentTimerId: number | null
}

type CycleActions = {
  setDurations: (newDurations: { [keys in Mode]: number }) => void;
  setLongBreakInterval: (newInterval: number) => void;
  setCyclesFromLongbreak: (cycles: number) => void;
  toNextMode: () => void;
  setCurrentTimerId: (id: number) => void;
}

const defaultCycleQueue = [
  Mode.FOCUS,
  Mode.SHORT_BREAK,
  Mode.FOCUS,
  Mode.SHORT_BREAK,
  Mode.FOCUS,
  Mode.SHORT_BREAK,
  Mode.FOCUS,
  Mode.LONG_BREAK
]

export const useCycleStore = create<TimerState & TimerActions & CycleState & CycleActions>((set) => ({
  // <-- timer state -->
  timeLeft: 300,
  timerPaused: true,
  setTimeLeft: (t: number) => set(() => ({timeLeft: t})),
  controlTimerPause: (b?: boolean) => set((state) => ({timerPaused: b ? b : !state.timerPaused})),

  // <-- cycle state -->
  durations: {
    [Mode.FOCUS]:
      usePomodoroStore.getState().settings.focus_duration * 60,
    [Mode.SHORT_BREAK]:
      usePomodoroStore.getState().settings.short_break_duration * 60,
    [Mode.LONG_BREAK]:
      usePomodoroStore.getState().settings.long_break_duration * 60
  },
  currentCycleQueue: defaultCycleQueue,
  currentMode: Mode.FOCUS,
  cyclesFromLongBreak: 4,
  currentTimerId: null,

  setDurations: (newDurations: { [keys in Mode]: number }) =>
    set(() => ({ durations: newDurations })),

  setLongBreakInterval: (interval: number) =>
    set((state) => ({
      currentCycleQueue: Array.from({ length: interval })
        .reduceRight<Mode[]>((queue, _, i) => {
          queue.unshift(i === 0 ? Mode.LONG_BREAK : Mode.SHORT_BREAK);
          queue.unshift(Mode.FOCUS);
          return queue;
        }, [])
    })),

  setCyclesFromLongbreak: (cycles: number) => set((state) => {
    return { cyclesFromLongBreak: cycles };
  }),

  toNextMode: () => set((state) => {
    if (state.currentCycleQueue.length === 0) return {};
    const [first, ...rest] = state.currentCycleQueue;
    const newQueue = [...rest, first];
    return {
      currentCycleQueue: newQueue,
      currentMode: newQueue[0]
    };
  }),

  setCurrentTimerId: (id: number) => set(() => ({currentTimerId: id}))
}))
