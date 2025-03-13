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
  longBreakInterval: number;
  cyclesFromLongBreak: number;
  currentTimerId: number | null
}

type CycleActions = {
  setDurations: (newDurations: { [keys in Mode]: number }) => void;
  setLongBreakInterval: (newInterval: number) => void;
  setCyclesFromLongbreak: (cycles: number, mode: "focus" | "long_break" | "short_break") => void;
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
  timeLeft: 1500,
  timerPaused: true,
  setTimeLeft: (t: number) => set(() => {
    console.log(`timeleft --> ${t}`);
    return { timeLeft: t }
  }),
  controlTimerPause: (b?: boolean) => set((state) => ({ timerPaused: b ? b : !state.timerPaused })),

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
  cyclesFromLongBreak: usePomodoroStore.getState().settings.cycles_before_long_break - 1,
  currentTimerId: null,
  longBreakInterval: usePomodoroStore.getState().settings.cycles_before_long_break,

  setDurations: (newDurations: { [keys in Mode]: number }) =>
    set(() => ({ durations: newDurations })),

  setLongBreakInterval: (interval: number) =>
    set((state) => ({
      currentCycleQueue: Array.from({ length: interval })
        .reduceRight<Mode[]>((queue, _, i) => {
          queue.unshift(i === 0 ? Mode.SHORT_BREAK : Mode.LONG_BREAK);
          queue.unshift(Mode.FOCUS);
          return queue;
        }, [])
    })),

  // <-- set the current cycle run from long break
  // preferably retrieved from api
  // don't use to move to next cycle
  setCyclesFromLongbreak: (cycles: number, mode: "focus" | "short_break" | "long_break") => set((state) => {
    if (state.currentCycleQueue.length === 0) {
      console.log('currentCycleQueue has length of 0');
      return {};
    }
    let newQueue = state.currentCycleQueue;
    console.log(`initial queue --> ${newQueue}`)
    for (let c = 0; c < state.longBreakInterval - cycles; c++) {
      for (let x = 0; x < 2; x++) {
        const m = newQueue.shift();
        if (!m) break;
        console.log(`${c} -> ${newQueue}`)
        newQueue.push(m);
      }
    }

    if (mode === "short_break" || mode === "long_break") {
      const x = newQueue.shift();
      if (x) newQueue.push(x);
    }

    console.log(newQueue);
    return {
      cyclesFromLongBreak: cycles,
      currentCycleQueue: newQueue,
      currentMode: newQueue[0]
    };
  }),

  toNextMode: () => set((state) => {
    if (state.currentCycleQueue.length === 0) return {};
    const [first, ...rest] = state.currentCycleQueue;
    const newQueue = [...rest, first];
    let newCyclesFromLngBrk = -1;
    if (state.currentMode !== Mode.FOCUS) {
      newCyclesFromLngBrk = state.cyclesFromLongBreak > 0 ? state.cyclesFromLongBreak - 1 : state.longBreakInterval
    }
    return newCyclesFromLngBrk < 0 ? {
      currentCycleQueue: newQueue,
      currentMode: newQueue[0]
    } : {
      currentCycleQueue: newQueue,
      currentMode: newQueue[0],
      cyclesFromLongBreak: newCyclesFromLngBrk
    };
  }),

  setCurrentTimerId: (id: number) => set(() => ({currentTimerId: id}))
}))
