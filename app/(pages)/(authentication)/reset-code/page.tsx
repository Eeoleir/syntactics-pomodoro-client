"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { useState, useEffect } from "react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  recoveryCode: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetCode() {
  const router = useRouter();
  const [timer, setTimer] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(false);

  const startTimer = () => {
    setTimer(300);
    setIsCounting(true);
  };

  useEffect(() => {
    if (timer > 0 && isCounting) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsCounting(false);
    }
  }, [timer, isCounting]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryCode: "",
    },
  });
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const onSubmit = (values: FormValues) => {
    console.log("Form data:", values);
    router.push("/new-password");
  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center flex-col">
      {isCounting && (
        <div className=" text-sm text-red font-bold left-0 ">
          Resend Code in {formatTime(timer)}
        </div>
      )}
      <div className="flex h-[384px] w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
        <div
          className="title flex flex-row h-auto p-6 pb-0 items-center gap-[10px] cursor-pointer"
          onClick={() => router.back()}
        >
          <IoArrowBack className="text-[20px] text-zinc-400" />
          <p className="text-[14px] mt-1 text-zinc-400 font-normal">Go back</p>
        </div>
        <div className="form text-[14px] p-6 pb-0 pt-6">
          <div className="text pb-6">
            <h2 className="text-2xl font-semibold">Enter Reset Code</h2>
            <h3 className="text-zinc-400 text-[16px] font-[700] pt-6">
              Check email for reset link
            </h3>
            <p className="text-zinc-400">
              Check the inbox of your email account, and input the reset code
              provided
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 text-left"
            >
              <FormField
                control={form.control}
                name="recoveryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        required
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter reset code"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="Request-btn pt-5">
                <Button type="submit" className="bg-[#84CC16] w-full">
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="links text-zinc-400 p-6 flex flex-col items-center text-sm space-y-1">
          <p>
            Didn’t receive an email?
            <button
              className={`underline ml-2 ${
                isCounting
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-[#84CC16]"
              }`}
              onClick={startTimer}
              disabled={isCounting}
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}
