"use client";

import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  email: string;
  name?: string;
}

export interface Preference {
  user_id: number;
  focus_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  cycles_before_long_break: number;
  is_auto_start_breaks: boolean;
  is_auto_start_focus: boolean;
  is_auto_complete_tasks: boolean;
  is_auto_switch_tasks: boolean;
  is_dark_mode: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  preferences: Preference | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setPreferences: (preferences: Preference) => void;
  checkTokenExpiration: () => void;
}

const TOKEN_EXPIRATION_MINUTES = 12;

const getInitialAuthState = (() => {
  let cachedState: {
    isAuthenticated: boolean;
    token: string | null;
    expiresAt: string | null;
  } | null = null;
  return () => {
    if (typeof window === "undefined") {
      return { isAuthenticated: false, token: null, expiresAt: null };
    }
    if (cachedState === null) {
      const token = Cookies.get("token") ?? null;
      const expiresAt = Cookies.get("tokenExpiresAt") ?? null;
      cachedState = {
        isAuthenticated:
          !!token && !!expiresAt && new Date(expiresAt) > new Date(),
        token,
        expiresAt,
      };
    }
    return cachedState;
  };
})();

const useAuthStore = create<AuthState>((set, get) => {
  const initialState = getInitialAuthState();
  return {
    isAuthenticated: initialState.isAuthenticated,
    user: null,
    token: initialState.token,
    preferences: null,

    login: (user, token) => {
      const expiresAt = new Date(
        Date.now() + TOKEN_EXPIRATION_MINUTES * 60 * 60 * 1000
      ).toISOString();
      Cookies.set("token", token, {
        expires: TOKEN_EXPIRATION_MINUTES / (24 * 60),
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("tokenExpiresAt", expiresAt, {
        expires: TOKEN_EXPIRATION_MINUTES / (24 * 60),
        secure: true,
        sameSite: "Strict",
      });
      set({ isAuthenticated: true, user, token });
    },

    logout: () => {
      Cookies.remove("token");
      Cookies.remove("tokenExpiresAt");
      localStorage.clear();
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        preferences: null,
      });
    },

    setPreferences: (preferences) => {
      set({ preferences });
    },

    checkTokenExpiration: () => {
      const expiresAt = Cookies.get("tokenExpiresAt");
      if (expiresAt && new Date(expiresAt) <= new Date()) {
        get().logout();
      }
    },
  };
});

if (typeof window !== "undefined") {
  setInterval(() => {
    useAuthStore.getState().checkTokenExpiration();
  }, 60 * 1000);
}

export default useAuthStore;
