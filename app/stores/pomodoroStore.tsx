import { create } from "zustand";

interface PomodoroState {
  settings: {
    focus_duration: number;
    short_break_duration: number;
    long_break_duration: number;
    cycles_before_long_break: number;
    is_auto_start_breaks: boolean;
    is_auto_start_focus: boolean;
    is_auto_complete_tasks: boolean;
    is_auto_switch_tasks: boolean;
    is_dark_mode: boolean;
  };
  userId: number | null; // Removed the stray 'A'
  setSettings: (settings: Partial<PomodoroState["settings"]>) => void;
  setUserId: (userId: number) => void;
}

export const usePomodoroStore = create<PomodoroState>((set) => ({
  settings: {
    focus_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    cycles_before_long_break: 4,
    is_auto_start_breaks: false,
    is_auto_start_focus: false,
    is_auto_complete_tasks: false,
    is_auto_switch_tasks: false,
    is_dark_mode: false,
  },
  userId: null,
  setSettings: (settings) =>
    set((state) => ({
      ...state,
      settings: { ...state.settings, ...settings },
    })),
  setUserId: (userId) => set({ userId }),
}));
