"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ResendTimer } from "@/components/custom/ResendTimer";
import { useMutation } from "@tanstack/react-query";
import { verifyResetCode } from "../../../../lib/auth-queries";
import { useState, useEffect } from "react";
import DarkModeToggle, {
  useDarkMode,
} from "@/components/custom/Toggle";

const formSchema = z.object({
  recoveryCode: z.string().min(4),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetCode() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode(); 

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/forgot-password");
    }
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      verifyResetCode({
        email,
        token: values.recoveryCode,
      }),
    onSuccess: (data) => {
      localStorage.setItem("resetToken", data.token);
      router.push("/new-password");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid or expired verification code";
      setErrorMessage(errorMessage);
    },
  });

  const onSubmit = (values: FormValues) => {
    setErrorMessage(null);
    mutation.mutate(values);
  };

  return (
    <section
      className={`content w-full h-screen mx-auto ${
        isDarkMode ? "bg-[#18181B] text-[#FAFAFA]" : "bg-gray-100 text-black"
      } flex justify-center items-center flex-col relative`}
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
        className={`flex h-fit w-[408px] border-[1px] rounded-xl border-[#84CC16] flex-col ${
          isDarkMode ? "bg-[#18181B]" : "bg-white"
        }`}
      >
        <div
          className="title flex flex-row h-auto p-6 pb-0 items-center gap-[10px] cursor-pointer"
          onClick={() => router.back()}
        >
          <IoArrowBack
            className={`text-[20px] ${
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            }`}
          />
          <p
            className={`text-[14px] mt-1 font-normal ${
              isDarkMode ? "text-zinc-400" : "text-gray-600"
            }`}
          >
            Go back
          </p>
        </div>
        <div className="form text-[14px] p-6 pb-0 pt-6">
          <div className="text pb-6">
            <h2 className="text-2xl font-semibold">Enter Reset Code</h2>
            <h3
              className={`text-[16px] font-[700] pt-6 ${
                isDarkMode ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Check email for reset link
            </h3>
            <p className={`${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
              Check the inbox of your email account, and input the reset code
              provided
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="text-left">
              <FormField
                control={form.control}
                name="recoveryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        className={`w-full ${
                          isDarkMode ? "bg-[#3D4142]" : "bg-gray-200"
                        } border-none px-3 py-1`}
                        placeholder="Enter reset code"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="mt-2 animate-fade-in">
                  <p className="text-red-500 text-xs">{errorMessage}</p>
                </div>
              )}

              <div className="Request-btn pt-6">
                <Button
                  type="submit"
                  className="bg-[#84CC16] w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Verifying..." : "Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div
          className={`links p-6 flex flex-col items-center text-sm space-y-1 ${
            isDarkMode ? "text-zinc-400" : "text-gray-600"
          }`}
        >
          <h3 className="flex flex-row gap-2">
            Didn't receive an email?
            <ResendTimer />
          </h3>
        </div>
      </div>
      <DarkModeToggle />
    </section>
  );
}
