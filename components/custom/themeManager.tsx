"use client";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/app/stores/themeStore";
import { useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPreferences, editDarkMode } from "@/lib/preference-queries";
import useAuthStore from "@/app/stores/authStore";


export function ThemeManager({
  children,
  userId,
}: Readonly<{
  children: ReactNode;
  userId?: number;
}>) {
  const { isDarkMode, setDarkMode } = useThemeStore();
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const { data: preferences } = useQuery({
    queryKey: [userId],
    queryFn: getPreferences,
    enabled: !!userId && !!token,
    initialData: [],
  });

  const mutation = useMutation({
    mutationFn: ({ id, is_dark_mode }: { id: number; is_dark_mode: number }) =>
      editDarkMode(id, is_dark_mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences", userId] });
    },
    onError: (error) => {
      console.error("Failed to update dark mode:", error);
    },
  });

  useEffect(() => {
    if ( userId && preferences.length > 0) {
      const userPreference = preferences[0];
      const dbDarkMode = userPreference.is_dark_mode;
      setDarkMode(!!dbDarkMode);
      document.documentElement.classList.toggle("dark", !!dbDarkMode);
    } else {

      document.documentElement.classList.toggle("dark", isDarkMode);
    }
  }, [userId, preferences, isDarkMode, setDarkMode]);

  useEffect(() => {
    if (userId) {
      mutation.mutate({ id: userId, is_dark_mode: isDarkMode ? 1 : 0 });
    }
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode, userId, mutation]);

  return <>{children}</>;
}

export function useTheme() {
  return useThemeStore();
}

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      onClick={toggleDarkMode}
      className={`fixed bottom-8 right-8 z-50 ${
        isDarkMode
          ? "bg-[#27272A] text-white hover:bg-[#3f3f46] border-[#84CC16] border"
          : "bg-[#F4F4F5] text-[#52525B] hover:bg-gray-200 border-[#84CC16] border"
      } h-12 w-12 rounded-full flex items-center justify-center shadow-lg`}
    >
      {isDarkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#71717A"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      )}
    </Button>
  );
}
