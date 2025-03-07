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
  timerId: number | null;
};

type CycleStateActions = {
  setDurations: (newDurations: { [keys in Mode]: number }) => void;
  setLongBreakInterval: (newInterval: number) => void;
  setIntervalCount: (newCount: number) => void;
  setTimeLeft: (mode: Mode, timeLeft: number) => void;
  activateNextMode: () => void;
  setIsPaused: (paused: boolean) => void;
  setNoAvailableTasks: (noAvailableTasks: boolean) => void;
  setTimerId: (id: number) => void;
};

export const useCycleStore = create<CycleState & CycleStateActions>((set) => ({

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
  currentMode: Mode.FOCUS,
  currentTimeLeft: 1500,
  nextMode: Mode.SHORT_BREAK,
  isTimerPaused: true,
  noAvailableTasks: false,
  timerId: null,

  setTimerId: (newTimerId: number) => set((state) => {
    if (!state.timerId) {
      return {timerId: newTimerId};
    } else {
      console.log(state.timerId);
      if (state.timerId < newTimerId) {
        return {
          timerId: newTimerId
        }
      }
    }
    return {};
  }),

  setDurations: (newDurations: { [keys in Mode]: number }) =>
    set(() => ({ durations: newDurations })),

  setLongBreakInterval: (newInterval: number) =>
    set(() => ({ longBreakInterval: newInterval })),

  setIntervalCount: (newIntervalCount: number) =>
    set(() => ({ longBreakIntervalCounter: newIntervalCount })),

  setTimeLeft: (mode: Mode, timeLeft: number) =>
    set((state) => {
      let nextModeValue: Mode;

      if (mode === Mode.FOCUS) {
        if (state.longBreakIntervalCounter + 1 === state.longBreakInterval) {
          nextModeValue = Mode.LONG_BREAK;
        } else {
          nextModeValue = Mode.SHORT_BREAK;
        }
      } else {
        nextModeValue = Mode.FOCUS;
      }

      return {
        currentMode: mode,
        currentTimeLeft: timeLeft,
        nextMode: nextModeValue,
      };
    }),

  activateNextMode: () =>
    set((state) => {
      console.log('activating next mode');
      let newCurrentMode: Mode;
      let newNextMode: Mode;
      let newIntervalCount: number = state.longBreakIntervalCounter;

      // Determine next mode based on current mode
      if (state.currentMode === Mode.FOCUS) {
        // After focus, determine break type
        newCurrentMode =
          state.longBreakIntervalCounter + 1 === state.longBreakInterval
            ? Mode.LONG_BREAK
            : Mode.SHORT_BREAK;

        // Increment interval counter
        newIntervalCount =
          newCurrentMode === Mode.LONG_BREAK ? 0 : newIntervalCount + 1;

        // Next mode will be focus
        newNextMode = Mode.FOCUS;
      } else {
        // After any break, always go to focus
        newCurrentMode = Mode.FOCUS;
        newNextMode =
          state.longBreakIntervalCounter + 1 === state.longBreakInterval
            ? Mode.LONG_BREAK
            : Mode.SHORT_BREAK;

        // Do not increment counter here
      }

      console.log(`
        new current mode: ${newCurrentMode},\n
        nextMode: ${newNextMode},\n
        currentTimeLeft: ${state.durations[newCurrentMode]},\n`)

      return {
        currentMode: newCurrentMode,
        nextMode: newNextMode,
        currentTimeLeft: state.durations[newCurrentMode],
        longBreakIntervalCounter: newIntervalCount,
      };
    }),

  setIsPaused: (paused: boolean) => set(() => ({ isTimerPaused: paused })),

  setNoAvailableTasks: (noAvailableTasks: boolean) =>
    set(() => ({ noAvailableTasks: noAvailableTasks })),
}));

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
