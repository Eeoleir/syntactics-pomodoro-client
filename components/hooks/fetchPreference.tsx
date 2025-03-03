"use client";

import { useEffect,useState } from "react";
import { usePomodoroStore, PomodoroState } from "@/app/stores/pomodoroStore";
import { getPreferences, editPreference } from "@/lib/preference-queries";

interface PomodoroDataProviderProps {
  children: (props: {
    settings: PomodoroState["settings"];
    userId: number | null;
    isLoading: boolean;
    error: Error | null;
    updateSettings: (data: Partial<PomodoroState["settings"]>) => Promise<void>;
  }) => React.ReactNode;
}

export default function PomodoroDataProvider({
  children,
}: PomodoroDataProviderProps) {
  const { settings, setSettings, userId, setUserId } = usePomodoroStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        const preferences = await getPreferences();

        if (preferences.length > 0) {
          const pref = preferences[0];
          setUserId(pref.user_id);

          const newSettings = {
            focus_duration: pref.focus_duration,
            short_break_duration: pref.short_break_duration,
            long_break_duration: pref.long_break_duration,
            cycles_before_long_break: pref.cycles_before_long_break,
            is_auto_start_breaks: pref.is_auto_start_breaks,
            is_auto_start_focus: pref.is_auto_start_focus,
            is_auto_complete_tasks: pref.is_auto_complete_tasks,
            is_auto_switch_tasks: pref.is_auto_switch_tasks,
            is_dark_mode: pref.is_dark_mode,
          };

          setSettings(newSettings);
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [setSettings, setUserId]);

  const updateSettings = async (data: Partial<PomodoroState["settings"]>) => {
    if (!userId) {
      console.error("No user ID available");
      throw new Error("No user ID available");
    }

    try {
      const updatedSettings = { ...settings, ...data };
      const response = await editPreference(userId, updatedSettings);
      const updatedPref = response.data;

      setSettings({
        focus_duration: updatedPref.focus_duration,
        short_break_duration: updatedPref.short_break_duration,
        long_break_duration: updatedPref.long_break_duration,
        cycles_before_long_break: updatedPref.cycles_before_long_break,
        is_auto_start_breaks: updatedPref.is_auto_start_breaks,
        is_auto_start_focus: updatedPref.is_auto_start_focus,
        is_auto_complete_tasks: updatedPref.is_auto_complete_tasks,
        is_auto_switch_tasks: updatedPref.is_auto_switch_tasks,
        is_dark_mode: updatedPref.is_dark_mode,
      });
    } catch (error) {
      console.error("Failed to save preferences:", error);
      throw error;
    }
  };

  return (
    <>
      {children({
        settings,
        userId,
        isLoading,
        error,
        updateSettings,
      })}
    </>
  );
}
