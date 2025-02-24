"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;


export default function Login() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(":", values);
    router.push("/dashboard");
    console.log("I am heree")
  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center">
      
      <div className="flex h-[398px] w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
        <div className="title flex flex-col h-auto p-6">
          <h2 className="text-2xl font-semibold">Log in</h2>
          <p className="text-[14px] mt-1 text-zinc-400 font-normal">
            Enter your account details to log in
          </p>
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
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your email"
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
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="loginBtn pt-5">
                <Button type="submit" className="bg-[#84CC16] w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="links text-zinc-400 px-6 pb-6 flex flex-col text-sm space-y-1 justify-center items-center">
          <p>
            New to Pomodoro?
            <Link href="/register">
              <span className="underline ml-2 text-[#84CC16]">
                Create Account
              </span>
            </Link>
          </p>
          <p>
            Forgot Password?
            <Link href="/forgot-password">
              <span className="underline ml-2 text-[#84CC16]">
                Reset Password
              </span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
