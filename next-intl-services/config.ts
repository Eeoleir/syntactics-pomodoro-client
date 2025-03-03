import { locales } from "@/app/stores/localeStore";

export type Locale = (typeof locales)[keyof typeof locales];

export const supportedLocales = Object.values(locales);
export const defaultLocale: Locale = "en";
