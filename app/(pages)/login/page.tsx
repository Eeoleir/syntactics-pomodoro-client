"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <section className="login w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] items-center flex justify-center">
      <div className="flex  h-[398px] w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
        <div className="title flex flex-col h-auto p-6 ">
          <h2 className="text-2xl font-semibold">Log in</h2>
          <p className="text-[14px] mt-1 gap-6 text-zinc-400 font-normal">
            Enter your account details to log in
          </p>
        </div>
        <div className="form text-[14px] p-6 pt-0">
          <Form {...form}>
            <form className="space-y-3 text-left">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text[14px]">
                      Email
                    </FormLabel>
                    <FormControl className="w-full ">
                      <Input
                        className="flex w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your email"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      Password
                    </FormLabel>
                    <FormControl className="w-full ">
                      <Input
                        className="flex w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="loginBtn pt-6">
                <Link href="/Dashboard">
                  <Button className="bg-[#84CC16] w-full flex">Login</Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
        <div className="links text-zinc-400 px-6 pb-6 items-center flex-col flex text-sm space-y-1">
          <p className="">
            New to Pomodoro
            <Link href={"/register"}>
              <span className="underline ml-2 text-[#84CC16]">
                Create Account
              </span>
            </Link>
          </p>
          <p className="gap-2">
            Forgot Password
            <Link href={"/register"}>
              <span className="underline ml-2 text-[#84CC16]">
                Forgot Password
              </span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
