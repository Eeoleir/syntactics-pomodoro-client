
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProfileState {
  profile: {
    name: string;
    email: string;
    profile_photo: string;
  } | null;
  setProfile: (profile: ProfileState["profile"]) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => {
        console.log("Setting profile:", profile);
        set({ profile });
      },
      clearProfile: () => {
        console.log("Clearing profile");
        set({ profile: null });
      },
    }),
    {
      name: "profile-storage", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
