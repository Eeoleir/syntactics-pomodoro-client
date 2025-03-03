"use client";

import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  email: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  preferences: any | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setPreferences: (preferences: any) => void;
}

const getInitialAuthState = (() => {
  let cachedState: { isAuthenticated: boolean; token: string | null } | null =
    null;
  return () => {
    if (typeof window === "undefined") {
      return { isAuthenticated: false, token: null };
    }
    if (cachedState === null) {
      const token = Cookies.get("token") || null;
      cachedState = {
        isAuthenticated: !!token,
        token,
      };
    }
    return cachedState;
  };
})();

const useAuthStore = create<AuthState>((set) => {
  const initialState = getInitialAuthState();
  return {
    isAuthenticated: initialState.isAuthenticated,
    user: null,
    token: initialState.token,
    preferences: null,

    login: (user, token) => {
      Cookies.set("token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      set({ isAuthenticated: true, user, token });
    },

    logout: () => {
      Cookies.remove("token");
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
  };
});

export default useAuthStore;
