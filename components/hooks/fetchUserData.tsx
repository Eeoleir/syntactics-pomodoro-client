"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/app/stores/profileStore";
import { fetchProfile, editProfile, Profile } from "@/lib/profile-queries";

interface UserDataProviderProps {
  children: (props: {
    profile: Profile | null;
    isLoading: boolean;
    error: Error | null;
    updateProfile: (
      data: Partial<Profile> & { profile_photo_file?: File }
    ) => Promise<Profile>; 
  }) => React.ReactNode;
}

export default function UserDataProvider({ children }: UserDataProviderProps) {
  const { profile, setProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("UserDataProvider: Initial profile:", profile);
    if (!profile) {
      const loadProfile = async () => {
        try {
          setIsLoading(true);
          const fetchedProfile = await fetchProfile();
          setProfile({
            name: fetchedProfile.name,
            email: fetchedProfile.email,
            profile_photo: fetchedProfile.profile_photo,
          });
        } catch (err) {
          console.error("Failed to load profile:", err);
          setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally {
          setIsLoading(false);
        }
      };
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [profile, setProfile]);

  const updateProfile = async (
    data: Partial<Profile> & { profile_photo_file?: File }
  ): Promise<Profile> => {

    try {
      const updatedProfile = await editProfile(data);
      setProfile({
        name: updatedProfile.name,
        email: updatedProfile.email,
        profile_photo: updatedProfile.profile_photo,
      });
      return updatedProfile; // Add return statement
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <>
      {children({
        profile,
        isLoading,
        error,
        updateProfile,
      })}
    </>
  );
}
