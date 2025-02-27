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
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!Cookies.get("token"),
  user: null,
  token: Cookies.get("token") || null,

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
    set({ isAuthenticated: false, user: null, token: null });
  },
}));

export default useAuthStore;
