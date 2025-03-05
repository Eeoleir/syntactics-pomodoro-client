"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../../../lib/auth-queries";
import useAuthStore from "@/app/stores/authStore";
import { useEffect, useState } from "react";
import { getPreferences } from "../../../../lib/preference-queries";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { fetchProfile } from "../../../../lib/profile-queries";
import { useProfileStore } from "@/app/stores/profileStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { settings, setSettings, setUserId } = usePomodoroStore();
  const { setProfile } = useProfileStore();
  const [errorKey, setErrorKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isDarkMode");
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  const pageTranslations = useTranslations("login-page");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (form.formState.errors.root) {
      setErrorKey((prev) => prev + 1);
    }
  }, [form.formState.errors.root]);

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      login(data.user, data.token);

      try {
        const fetchedProfile = await fetchProfile();
        setProfile({
          name: fetchedProfile.name,
          email: fetchedProfile.email,
          profile_photo: fetchedProfile.profile_photo,
        });
      } catch (error) {}

      try {
        const preferences = await getPreferences();
        if (preferences.length > 0) {
          const pref = preferences[0];
          setUserId(pref.user_id);
          setSettings({
            focus_duration: pref.focus_duration,
            short_break_duration: pref.short_break_duration,
            long_break_duration: pref.long_break_duration,
            cycles_before_long_break: pref.cycles_before_long_break,
            is_auto_start_breaks: pref.is_auto_start_breaks,
            is_auto_start_focus: pref.is_auto_start_focus,
            is_auto_complete_tasks: pref.is_auto_complete_tasks,
            is_auto_switch_tasks: pref.is_auto_switch_tasks,
            is_dark_mode: pref.is_dark_mode,
          });
        }
      } catch (error) {}

      router.push("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Incorrect email or password";
      form.setError("root", { message: errorMessage });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <section
      className={`content w-full h-screen mx-auto ${
        isDarkMode ? "bg-[#18181B] text-[#FAFAFA]" : "bg-gray-100 text-black"
      } flex justify-center items-center relative`}
    >
      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex h-fit w-[408px] border-[1px] rounded-xl bg-inherit border-[#84CC16] flex-col">
        <div className="title flex flex-row justify-between items-center h-auto p-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">
              {pageTranslations("login-header")}
            </h2>
            <p className="text-[14px] mt-1 text-zinc-400 font-normal">
              {pageTranslations("login-subheader")}
            </p>
          </div>
        </div>
        <div className="form text-[14px] p-6 pt-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 text-left"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      {pageTranslations("text-fields.email-field.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder={pageTranslations(
                          "text-fields.email-field.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      {pageTranslations("text-fields.password-field.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder={pageTranslations(
                          "text-fields.password-field.placeholder"
                        )}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div
                  key={errorKey}
                  className="flex flex-row justify-between items-center animate-fade-in animate-shake"
                >
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.root.message}
                  </p>
                  <p>
                    <Link href="/forgot-password">
                      <span className="flex justify-end ml-2 text-xs text-[#84CC16]">
                        {pageTranslations("links.forgot-password-notice.text")}
                      </span>
                    </Link>
                  </p>
                </div>
              )}

              <div className="loginBtn pt-5">
                <Button
                  type="submit"
                  className="bg-[#84CC16] w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? pageTranslations("buttons.submit-button.on-click")
                    : pageTranslations("buttons.submit-button.text")}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="links text-zinc-400 px-6 pb-6 flex flex-col text-sm space-y-1 justify-center items-center">
          <p>
            {pageTranslations("links.create-account-notice.text")}
            <Link href="/register">
              <span className="underline ml-2 text-[#84CC16]">
                {pageTranslations("links.create-account-notice.link-text")}
              </span>
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom-right toggle button */}
      <Button
        onClick={toggleDarkMode}
        className={`fixed bottom-8 right-8 z-50 ${
          isDarkMode
            ? "bg-[#27272A] text-white hover:bg-[#3f3f46] border-[#84CC16] border"
            : "bg-[#F4F4F5] text-[#52525B] hover:bg-gray-200 border-[#84CC16] border"
        } h-12 w-12 rounded-full flex items-center justify-center shadow-lg`}
      >
        {isDarkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#71717A"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        )}
      </Button>
    </section>
  );
}
