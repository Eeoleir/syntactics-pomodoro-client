// @/app/stores/profileStore.ts
import { create } from "zustand";

interface ProfileState {
  profile: {
    name: string;
    email: string;
    profile_photo: string;
  } | null;
  setProfile: (profile: ProfileState["profile"]) => void;
}


const isBrowser = typeof window !== "undefined";

const loadInitialProfile = () => {
  if (!isBrowser) return null; 
  const stored = localStorage.getItem("profile");
  return stored ? JSON.parse(stored) : null;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: loadInitialProfile(), 
  setProfile: (profile) => {
    set({ profile });
    if (isBrowser && profile) {
      localStorage.setItem("profile", JSON.stringify(profile)); 
    }
  },
}));
