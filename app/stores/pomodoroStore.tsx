import { create } from "zustand";
import { persist } from "zustand/middleware";
import { locales } from "@/app/stores/localeStore";
import { Locale } from "@/next-intl-services/config";

export interface PomodoroState {
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
    language: Locale; 
  };
  userId: number | null;
  setSettings: (settings: Partial<PomodoroState["settings"]>) => void;
  setUserId: (userId: number) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
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
        language: locales.ENGLISH, 
      },
      userId: null,
      setSettings: (settings) =>
        set((state) => ({
          ...state,
          settings: { ...state.settings, ...settings },
        })),
      setUserId: (userId) => set({ userId }),
    }),
    {
      name: "pomodoro-preferences-storage",
    }
  )
);