"use client";

import { Locale } from "@/next-intl-services/config";
import { getUserLocale, setUserLocale } from "@/services/locale";
import { useEffect } from "react";
import { create } from "zustand";

export const locales = {
  ENGLISH: "en",
  PORTUGUESE: "pt",
  JAPANESE: "ja",
} as const;

type LocaleState = {
  currentLocale: Locale;
  initialized: boolean;
};

type LocaleActions = {
  setCurrentLocale: (newLocale: Locale) => void;
  initializeLocale: () => Promise<void>;
};

export const useLocaleStore = create<LocaleState & LocaleActions>((set) => ({
  currentLocale: locales.ENGLISH,
  initialized: false,

  setCurrentLocale: (newLocale: Locale) => {
    setUserLocale(newLocale); 
    set({ currentLocale: newLocale });
  },

  initializeLocale: async () => {
    const userLocale = (await getUserLocale()) as Locale;
    set({ currentLocale: userLocale, initialized: true });
  },
}));

export default function LocaleInitializer() {
  const { initializeLocale, initialized } = useLocaleStore();

  useEffect(() => {
    if (!initialized) {
      initializeLocale();
    }
  }, [initialized, initializeLocale]);

  return null;
}
