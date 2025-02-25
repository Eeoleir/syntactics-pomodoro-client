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

const formSchema = z
  .object({
    username: z.string().min(6),
    email: z.string().email(),
    password: z.string().min(6),
    repassword: z.string().min(6),
  })
  .refine((data) => data.password === data.repassword, {
    path: ["repassword"],
  });

  type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repassword: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    router.push("/login");
    console.log("I am heree")
  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center">
      <div className="flex h-[519px] w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
        <div className="title flex flex-col p-6 pb-5">
          <h2 className="text-2xl font-semibold">Create an Account</h2>
          <p className="text-[14px] mt-1 text-zinc-400">
            Enter your email below to create your account
          </p>
        </div>
        <div className="form text-[14px] p-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your username"
                        required
                        {...field}
                      />
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
                      <Input
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your email"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">Password</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="repassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      Re-enter Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Re-enter your password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="registerBtn pt-3">
                  <Button type="submit" className="bg-[#84CC16] w-full flex">
                    Register
                  </Button>         
              </div>
            </form>
          </Form>
        </div>
        <div className="links text-zinc-400 px-6 pb-6 flex flex-col items-center text-sm space-y-1">
          <p>
            Already have an account?
            <Link href={"/login"}>
              <span className="underline ml-2 text-[#84CC16]">Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
