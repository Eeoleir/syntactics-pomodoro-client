"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../../lib/auth-queries";
import { useState, useEffect } from "react";

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    repassword: z.string().min(6),
  })
  .refine((data) => data.password === data.repassword, {
    path: ["repassword"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function NewPassword() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {
    const storedToken = localStorage.getItem("resetToken");
    if (!storedToken) {
      router.push("/forgot-password");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      repassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      resetPassword({
        password: values.password,
        password_confirmation: values.repassword,
        token: token || "",
      }),
    onSuccess: (data) => {
    
      localStorage.removeItem("resetToken"); 
      router.push("/login");
    },
    onError: (error: any) => {
      const errorMsg = error.message || "Failed to reset password";
      setErrorMessage(errorMsg);
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!token) {
      setErrorMessage("Reset token is missing");
      return;
    }
    setErrorMessage(null);
    mutation.mutate(values);
  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center flex-col">
      <div className="flex h-[368px] w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
        <div
          className="title flex flex-row h-auto p-6 pb-0 items-center gap-[10px] cursor-pointer"
          onClick={() => router.back()}
        >
          <IoArrowBack className="text-[20px] text-zinc-400" />
          <p className="text-[14px] mt-1 text-zinc-400 font-normal">Go back</p>
        </div>
        <div className="form text-[14px] p-6 pb-0 pt-6">
          <div className="text pb-6 space-y-[10px]">
            <h2 className="text-2xl font-semibold">New Password</h2>
            <p className="text-zinc-400 text-[16px] font-[700]">
              Please create a new password that you don’t use on any other site.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 text-left"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        required
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Create new password"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        required
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.repassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.repassword.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              {errorMessage && (
                <p className="text-red-500 text-xs">{errorMessage}</p>
              )}
              <div className="Request-btn pt-3 pb-6">
                <Button
                  type="submit"
                  className="bg-[#84CC16] w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Resetting..." : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}