import React, { useState, useEffect } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, editProfile } from "@/lib/profile-queries";
import { useProfileStore } from "@/app/stores/profileStore";

const formSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
    },
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      console.log("useQuery success - Fetched data:", data);
      setProfile({
        name: data.name,
        email: data.email,
        profile_photo: data.profile_photo,
      });
      form.reset({
        name: data.name,
        email: data.email,
      });
    }
  }, [data, form, setProfile]);

  useEffect(() => {
    if (error) {
      console.error("useQuery error:", error);
    }
  }, [error]);

  const mutation = useMutation({
    mutationFn: editProfile,
    onSuccess: (updatedData) => {
      setProfile({
        name: updatedData.name,
        email: updatedData.email,
        profile_photo: updatedData.profile_photo,
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    form.reset({ name: profile?.name || "", email: profile?.email || "" });
  };

  // Render with profile if available, show loading only during fetch
  const renderContent = () => {
    if (!profile && isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading profile: {error.message}</div>;

    return (
      <div className="profile flex flex-col items-center justify-between h-auto min-h-[400px] sm:min-h-[594px] gap-3 sm:gap-4 md:gap-[12px] text-[14px] lg:w-1/3">
        <div className="PPcontianer flex items-center justify-center pt-4">
          <ProfilePicture
            size="lg"
            editable={isEditing}
            src={profile?.profile_photo} // Use store instead of data
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
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!isEditing}
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Name"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={!isEditing}
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="m@example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="btns flex flex-col gap-2 sm:gap-[10px] w-full mt-6 sm:mt-8 px-4 sm:px-0">
          {isEditing ? (
            <div className="flex flex-row gap-2 sm:gap-[10px]">
              <Button
                type="button"
                className="w-full py-3 sm:py-4 px-4 bg-[#CC8484]"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full py-3 sm:py-4 px-4 bg-[#84CC16]"
                onClick={form.handleSubmit(onSubmit)}
                disabled={mutation.isPending}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              className="w-full py-3 sm:py-4 px-4 bg-[#71717A]"
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          )}
          <Button className="w-full py-3 sm:py-4 px-4 bg-[#84CC16]">
            Logout
          </Button>
        </div>
      </div>
    );
  };

  console.log("Rendering UI - Profile:", profile);
  console.log("Rendering UI - Profile photo URL:", profile?.profile_photo);
  console.log("Rendering UI - Form values:", form.getValues());

  return <>{renderContent()}</>;
}
