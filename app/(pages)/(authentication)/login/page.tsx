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
  const login = useAuthStore((state) => state.login);
  const [errorKey, setErrorKey] = useState(0); // Used to retrigger animation

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Watch for changes in the root error to trigger animation
  useEffect(() => {
    if (form.formState.errors.root) {
      setErrorKey(prev => prev + 1);
    }
  }, [form.formState.errors.root]);

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      console.log("Sign-in successful:", data);
      login(data.user, data.token);
      router.push("/dashboard");
    },
    onError: (error: any) => {
      // Try to extract the specific error message from the server response
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Incorrect email or password";
      
      form.setError("root", { message: errorMessage });
    }
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form data:", values);
    mutation.mutate(values);
  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center">
      {/* First, add the necessary keyframes to your global CSS or in your Tailwind config */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex h-fit w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
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
                        Forgot Password?
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
                  {mutation.isPending ? "Logging In..." : "Login"}
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
        </div>
      </div>
    </section>
  );
}