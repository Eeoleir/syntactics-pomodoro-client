import { create } from "zustand";
import { usePomodoroStore } from "./pomodoroStore";

export enum Mode {
  FOCUS = "focus",
  SHORT_BREAK = "short-break",
  LONG_BREAK = "long-break",
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
};

type CycleStateActions = {
  setDurations: (newDurations: { [keys in Mode]: number }) => void;
  setLongBreakInterval: (newInterval: number) => void;
  setIntervalCount: (newCount: number) => void; // set a new interval count altogether
  setTimeLeft: (mode: Mode, timeLeft: number) => void; //one action for both current time left and current mode
  activateNextMode: () => void;
  setIsPaused: (paused: boolean) => void;
  setNoAvailableTasks: (noAvailableTasks: boolean) => void;
};

export const useCycleStore = create<CycleState & CycleStateActions>((set) => ({
  // state properties
  durations: {
    [Mode.FOCUS]: usePomodoroStore.getState().settings.focus_duration * 60, // convert minutes to seconds
    [Mode.SHORT_BREAK]:
      usePomodoroStore.getState().settings.short_break_duration * 60,
    [Mode.LONG_BREAK]:
      usePomodoroStore.getState().settings.long_break_duration * 60,
  },
  longBreakInterval:
    usePomodoroStore.getState().settings.cycles_before_long_break,
  longBreakIntervalCounter: 0,
  currentMode: Mode.FOCUS,
  currentTimeLeft: 1500,
  nextMode: Mode.SHORT_BREAK,
  isTimerPaused: true,
  noAvailableTasks: false,

  // actions
  setDurations: (newDurations: { [keys in Mode]: number }) =>
    set(() => ({ durations: newDurations })),
  setLongBreakInterval: (newInterval: number) =>
    set(() => ({ longBreakInterval: newInterval })),
  setIntervalCount: (newIntervalCount: number) =>
    set(() => ({ longBreakIntervalCounter: newIntervalCount })),
  setTimeLeft: (newMode: Mode, newTimeLeft: number) =>
    set(() => ({ currentMode: newMode, currentTimeLeft: newTimeLeft })),
  activateNextMode: () =>
    set((state) => {
      let newNextMode: Mode;
      let newIntervalCount: number;

      console.log(
        `currentMode: ${state.currentMode}, nextMode: ${state.nextMode}`
      );

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

// Subscribe to pomodoroStore changes
usePomodoroStore.subscribe((state) => {
  useCycleStore.getState().setDurations({
    [Mode.FOCUS]: state.settings.focus_duration * 60,
    [Mode.SHORT_BREAK]: state.settings.short_break_duration * 60,
    [Mode.LONG_BREAK]: state.settings.long_break_duration * 60,
  });
  useCycleStore
    .getState()
    .setLongBreakInterval(state.settings.cycles_before_long_break);
});
