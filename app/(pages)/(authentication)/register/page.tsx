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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, // Added for error display
} from "@/components/ui/form";

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
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      router.push("/login"); // Redirect to login after success
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
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
                control={form.control} 
                name="name"
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
                    <FormMessage /> {/* Display validation errors */}
                  </FormItem>
                )}
              />
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
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
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
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-[14px]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter your password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
             
              
              <div className="registerBtn pt-3">
                <Button
                  type="submit"
                  className="bg-[#84CC16] w-full flex"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Registering..." : "Register"}
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
