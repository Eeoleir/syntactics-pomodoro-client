import { create } from 'zustand';

export enum Mode {
  FOCUS = "focus",
  SHORT_BREAK = "short_break",
  LONG_BREAK = "long_break"
}

type CycleState = {
  durations: { [keys in Mode]: number },
  longBreakInterval: number,
  longBreakIntervalCounter: number,
  currentMode: Mode,
  currentTimeLeft: number,
  nextMode: Mode
}

type CycleStateActions = {
  setDurations: ( newDurations: { [keys in Mode]: number } ) => void,
  setLongBreakInterval: (newInterval: number) => void,
  setIntervalCount: (newCount: number) => void, // set a new interval count altogether
  setTimeLeft: (mode: Mode, timeLeft: number) => void, //one action for both current time left and current mode
  activateNextMode: () => void,
}

export const useCycleStore = create<CycleState & CycleStateActions>((set) => ({
  // state properties
  durations: {
    // dapat mag query og data para ani
    [Mode.FOCUS]: 10, // 1500
    [Mode.SHORT_BREAK]: 15, // 300
    [Mode.LONG_BREAK]: 25 // 900
  },
  longBreakInterval: 4,
  longBreakIntervalCounter: 0,
  currentMode: Mode.FOCUS,
  currentTimeLeft: 1500,
  nextMode: Mode.SHORT_BREAK,

  // actions
  setDurations: (newDurations: { [keys in Mode]: number} ) => set(() => ({durations: newDurations})),
  setLongBreakInterval: (newInterval: number) => set(() => ({longBreakInterval: newInterval})),
  setIntervalCount: (newIntervalCount: number) => set(() => ({longBreakIntervalCounter: newIntervalCount})),
  setTimeLeft: (newMode: Mode, newTimeLeft: number) => set(() => ({currentMode: newMode, currentTimeLeft: newTimeLeft})),
  activateNextMode: () => set((state) => {
    let newNextMode: Mode;
    let newIntervalCount: number;

    console.log(`currentMode: ${state.currentMode}, nextMode: ${state.nextMode}`)

    if (state.currentMode === Mode.FOCUS) {
      newNextMode = Mode.FOCUS;
      newIntervalCount = state.longBreakIntervalCounter + 1;
    } else {
      newNextMode = (state.longBreakIntervalCounter + 1) === state.longBreakInterval
        ? Mode.LONG_BREAK
        : Mode.SHORT_BREAK;
      newIntervalCount = state.longBreakIntervalCounter === state.longBreakInterval
        ? 0
        : state.longBreakIntervalCounter
    }

    return {
      currentMode: state.nextMode,
      nextMode: newNextMode,
      longBreakIntervalCounter: newIntervalCount
    }
  })
}))
