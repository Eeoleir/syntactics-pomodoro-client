"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale } from "@/next-intl-services/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

export async function getUserLocale() {
  const l = (await cookies()).get(LOCALE_COOKIE)?.value || defaultLocale;
  return l;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE, locale);
}

export async function deleteCookie(name: string) {
  (await cookies()).delete(name);
}
