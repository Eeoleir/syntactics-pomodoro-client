import { create } from "zustand";
import { usePomodoroStore } from "./pomodoroStore";

export enum Mode {
  FOCUS = "focus",
  SHORT_BREAK = "short_break",
  LONG_BREAK = "long_break",
}

type Tasks = {
  tasks: [];
};

type CycleState = {
  durations: { [keys in Mode]: number };
  longBreakInterval: number;
  longBreakIntervalCounter: number;
  currentMode: Mode;
  currentTimeLeft: number;
  nextMode: Mode;
  isTimerPaused: boolean;
  noAvailableTasks: boolean;
  lastTimerUpdate: number;
};

type CycleStateActions = {
  setDurations: (newDurations: { [keys in Mode]: number }) => void;
  setLongBreakInterval: (newInterval: number) => void;
  setIntervalCount: (newCount: number) => void;
  setTimeLeft: (mode: Mode, timeLeft: number) => void;
  activateNextMode: () => void;
  setIsPaused: (paused: boolean) => void;
  setNoAvailableTasks: (noAvailableTasks: boolean) => void;
};

// Get initial values from localStorage or fall back to defaults
const getInitialState = () => {
  const savedState = localStorage.getItem("cycleStore");
  if (savedState) {
    const parsed = JSON.parse(savedState);
    return {
      durations: parsed.durations,
      currentMode: parsed.currentMode,
      currentTimeLeft: parsed.currentTimeLeft,
      // ... other state values you want to persist
    };
  }

  return {
    durations: {
      [Mode.FOCUS]: usePomodoroStore.getState().settings.focus_duration * 60,
      [Mode.SHORT_BREAK]:
        usePomodoroStore.getState().settings.short_break_duration * 60,
      [Mode.LONG_BREAK]:
        usePomodoroStore.getState().settings.long_break_duration * 60,
    },
    currentMode: Mode.FOCUS,
    currentTimeLeft: 1500,
    // ... other default values
  };
};

export const useCycleStore = create<CycleState & CycleStateActions>((set) => ({
  // state properties
  ...getInitialState(),

  durations: {
    [Mode.FOCUS]: usePomodoroStore.getState().settings.focus_duration * 60,
    [Mode.SHORT_BREAK]:
      usePomodoroStore.getState().settings.short_break_duration * 60,
    [Mode.LONG_BREAK]:
      usePomodoroStore.getState().settings.long_break_duration * 60,
  },
  longBreakInterval:
    usePomodoroStore.getState().settings.cycles_before_long_break,
  longBreakIntervalCounter: 0,
  nextMode: Mode.SHORT_BREAK,
  isTimerPaused: true,
  noAvailableTasks: false,
  lastTimerUpdate: Date.now(),


  setDurations: (newDurations: { [keys in Mode]: number }) =>
    set((state) => {
      const newState = {
        ...state,
        durations: newDurations,
        currentTimeLeft:
          newDurations[state.currentMode] || state.currentTimeLeft,
        lastTimerUpdate: Date.now(),
      };
      localStorage.setItem("cycleStore", JSON.stringify(newState));
      console.log("Durations Updated:", {
        durations: newDurations,
        currentTimeLeft: newState.currentTimeLeft,
        currentMode: state.currentMode,
      });
      return newState;
    }),

  setTimeLeft: (newMode: Mode, newTimeLeft: number) =>
    set((state) => {
      const newState = {
        ...state,
        currentMode: newMode,
        currentTimeLeft: newTimeLeft,
        lastTimerUpdate: Date.now(),
        durations: {
          ...state.durations,
          [newMode]: newTimeLeft,
        },
      };
      localStorage.setItem("cycleStore", JSON.stringify(newState));
      console.log("Timer State Updated:", {
        mode: newMode,
        timeLeft: newTimeLeft,
        currentTimeLeft: newState.currentTimeLeft,
        durations: newState.durations,
      });
      return newState;
    }),

  setLongBreakInterval: (newInterval: number) =>
    set(() => ({ longBreakInterval: newInterval })),
  setIntervalCount: (newIntervalCount: number) =>
    set(() => ({ longBreakIntervalCounter: newIntervalCount })),
  activateNextMode: () =>
    set((state) => {
      let newNextMode: Mode;
      let newIntervalCount: number;

      if (state.currentMode === Mode.FOCUS) {
        newNextMode = Mode.FOCUS;
        newIntervalCount = state.longBreakIntervalCounter + 1;
      } else {
        newNextMode =
          state.longBreakIntervalCounter + 1 === state.longBreakInterval
            ? Mode.LONG_BREAK
            : Mode.SHORT_BREAK;
        newIntervalCount =
          state.longBreakIntervalCounter === state.longBreakInterval
            ? 0
            : state.longBreakIntervalCounter;
      }

      return {
        currentMode: state.nextMode,
        nextMode: newNextMode,
        longBreakIntervalCounter: newIntervalCount,
      };
    }),
  setIsPaused: (paused: boolean) => set(() => ({ isTimerPaused: paused })),
  setNoAvailableTasks: (noAvailableTasks: boolean) =>
    set(() => ({ noAvailableTasks: noAvailableTasks })),
}));

// Update subscription to preserve timer-set durations
usePomodoroStore.subscribe((state) => {
  const currentDurations = useCycleStore.getState().durations;

  // Only update durations if they haven't been set by a timer
  if (currentDurations[Mode.FOCUS] === 0) {
    currentDurations[Mode.FOCUS] = state.settings.focus_duration * 60;
  }
  if (currentDurations[Mode.SHORT_BREAK] === 0) {
    currentDurations[Mode.SHORT_BREAK] =
      state.settings.short_break_duration * 60;
  }
  if (currentDurations[Mode.LONG_BREAK] === 0) {
    currentDurations[Mode.LONG_BREAK] = state.settings.long_break_duration * 60;
  }

  useCycleStore.getState().setDurations(currentDurations);
  useCycleStore
    .getState()
    .setLongBreakInterval(state.settings.cycles_before_long_break);
});
