"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../../../lib/auth-queries";
import DarkModeToggle, {
  useDarkMode,
} from "@/components/custom/Toggle";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";

const formSchema = z
  .object({
    name: z
      .string()
      .min(6, { message: "Username must be at least 6 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    repassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const router = useRouter();
  const pageTranslations = useTranslations("create-account-page");
  const { isDarkMode } = useDarkMode(); 
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      alert("Account created successfully!");
      router.push("/login");
    },
    onError: (error: Error) => {
      form.setError("root", {
        message: error.message || "Registration failed",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    const { name, email, password } = data;
    mutation.mutate({ name, email, password });
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

      <div
        className={`flex h-[519px] w-[408px] border-[1px] rounded-xl border-[#84CC16] flex-col ${
          isDarkMode ? "bg-[#18181B]" : "bg-white"
        }`}
      >
        <div className="title flex flex-col p-6 pb-5">
          <h2 className="text-2xl font-semibold">
            {pageTranslations("create-account-header")}
          </h2>
          <p className="text-[14px] mt-1 text-zinc-400">
            {pageTranslations("create-account-subheader")}
          </p>
        </div>
        <div className="form text-[14px] p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      {pageTranslations("text-fields.username-field.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder={pageTranslations(
                          "text-fields.username-field.placeholder"
                        )}
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder={pageTranslations(
                          "text-fields.email-field.placeholder"
                        )}
                        required
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
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder={pageTranslations(
                          "text-fields.password-field.placeholder"
                        )}
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      {pageTranslations("text-fields.re-password-field.title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder={pageTranslations(
                          "text-fields.re-password-field.placeholder"
                        )}
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-red-500 text-xs animate-fade-in">
                  {form.formState.errors.root.message}
                </div>
              )}
              {form.formState.errors.repassword && (
                <div className="text-red-500 text-xs animate-fade-in">
                  {form.formState.errors.repassword.message}
                </div>
              )}

              <div className="registerBtn pt-3">
                <Button
                  type="submit"
                  className="bg-[#84CC16] w-full flex"
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
        <div className="links text-zinc-400 px-6 pb-6 flex flex-col items-center text-sm space-y-1">
          <p>
            {pageTranslations("links.login-instead.text")}
            <Link href={"/login"}>
              <span className="underline ml-2 text-[#84CC16]">
                {pageTranslations("links.login-instead.link-text")}
              </span>
            </Link>
          </p>
        </div>
      </div>
      <DarkModeToggle />
    </section>
  );
}
