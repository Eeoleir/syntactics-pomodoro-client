"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import ProfilePicture from "@/components/custom/settings/profile_picture";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import UserDataProvider from "@/components/hooks/fetchUserData";
import { Profile } from "@/lib/profile-queries";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

function EditProfileComponent({
  profile,
  isLoading,
  error,
  updateProfile,
}: {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (
    data: Partial<Profile> & { profile_photo_file?: File }
  ) => Promise<Profile>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings } = usePomodoroStore();
  const isDarkMode = settings.is_dark_mode;
  const translations = useTranslations("components.edit-profile");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
      });
      setPreviewUrl(profile.profile_photo);
    }
  }, [profile, form]);

  const onSubmit = async (values: FormValues) => {
    const changedFields: Partial<Profile> & { profile_photo_file?: File } = {};
    if (values.name !== profile?.name) changedFields.name = values.name;
    if (values.email !== profile?.email) changedFields.email = values.email;
    if (selectedFile) changedFields.profile_photo_file = selectedFile;

    if (Object.keys(changedFields).length > 0) {
      // console.log("Submitting changes:", changedFields);
      try {
        const updatedProfile = await updateProfile(changedFields);
        // console.log("Updated profile received:", updatedProfile);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(updatedProfile.profile_photo);
        if (fileInputRef.current) fileInputRef.current.value = "";

        form.reset({
          name: updatedProfile.name || "",
          email: updatedProfile.email || "",
        });
      } catch (err) {
        console.error("Error updating profile:", err);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(profile?.profile_photo);
    if (fileInputRef.current) fileInputRef.current.value = "";
    form.reset({ name: profile?.name || "", email: profile?.email || "" });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      // console.log("Selected file:", file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (error) return <div>Error loading profile: {error.message}</div>;

  return (
    <div className="profile flex flex-col items-center justify-between h-auto min-h-[400px] sm:min-h-[594px] gap-3 sm:gap-4 md:gap-[12px] text-[14px] lg:w-1/3">
      <div className="PPcontianer flex items-center justify-center pt-4">
        {isLoading ? (
          <div
            className={`w-[120px] h-[120px] rounded-full ${
              isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
            } animate-pulse`}
          />
        ) : (
          <ProfilePicture
            size="lg"
            editable={isEditing}
            src={previewUrl}
            onFileChange={isEditing ? triggerFileInput : undefined}
          />
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="fields w-full p-4 sm:p-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[14px]">
                    {translations("fields.name.title")}
                  </FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <div
                        className={`w-full h-8 ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } animate-pulse rounded`}
                      />
                    ) : (
                      <Input
                        disabled={!isEditing}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-[#3D4142] text-white border-[#27272A]"
                            : "bg-[white] text-[##71717A] border-[#E4E4E7]"
                        } border px-3 py-1`}
                        placeholder={translations("fields.name.placeholder")}
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-[14px]">Email</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <div
                        className={`w-full h-8 ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } animate-pulse rounded`}
                      />
                    ) : (
                      <Input
                        disabled={!isEditing}
                        className={`w-full ${
                          isDarkMode
                            ? "bg-[#3D4142] text-white border-[#27272A]"
                            : "bg-[white] text-[##71717A] border-[#E4E4E7]"
                        } border px-3 py-1`}
                        placeholder="m@example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
            {isEditing && (
              <div className="flex flex-row gap-2 sm:gap-[10px] mt-6">
                {isLoading ? (
                  <>
                    <div
                      className={`w-full h-10 ${
                        isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                      } animate-pulse rounded`}
                    />
                    <div
                      className={`w-full h-10 ${
                        isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                      } animate-pulse rounded`}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="w-full py-3 sm:py-4 px-4 bg-[#CC8484]"
                      onClick={handleCancelClick}
                    >
                      {translations("buttons.cancel.text")}
                    </Button>
                    <Button
                      type="submit"
                      className="w-full py-3 sm:py-4 px-4 bg-[#84CC16]"
                    >
                      {translations("buttons.submit-changes.text")}
                    </Button>
                  </>
                )}
              </div>
            )}
          </form>
        </Form>
      </div>

      {!isEditing && (
        <div className="btns flex flex-col gap-2 sm:gap-[10px] w-full mt-6 sm:mt-8 px-4 sm:px-0">
          {isLoading ? (
            <>
              <div
                className={`w-full h-10 ${
                  isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                } animate-pulse rounded`}
              />
              <div
                className={`w-full h-10 ${
                  isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                } animate-pulse rounded`}
              />
            </>
          ) : (
            <>
              <Button
                className="w-full py-3 sm:py-4 px-4 bg-[#71717A]"
                onClick={handleEditClick}
              >
                {translations("buttons.edit-profile.text")}
              </Button>
              <Button className="w-full py-3 sm:py-4 px-4 bg-[#84CC16]">
                {translations("buttons.logout.text")}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function EditProfile() {
  return (
    <UserDataProvider>
      {({ profile, isLoading, error, updateProfile }) => (
        <EditProfileComponent
          profile={profile}
          isLoading={isLoading}
          error={error}
          updateProfile={updateProfile}
        />
      )}
    </UserDataProvider>
  );
}
