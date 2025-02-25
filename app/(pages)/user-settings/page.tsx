"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoArrowBack } from "react-icons/io5";
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
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex flex-col py-[67px] px-[160px] gap-[48px]">
      <div className="title flex flex-row items-center gap-2  w-full gqp-[10px] text-zinc-200">
        <IoArrowBack className="text-white size-[44px] "/>
        <h2 className="text-white text-2xl font-semibold text-[40px]">Settings</h2>
      </div>

      <div className="content gap-[36px] flex flex-row">
        <div className="profile items-center justify-between flex h-auto bg-white w-[32%] flex-col">
            <div className="profile-data h-auto mt-6 items-center justify-center">
                <div className="profle-pic w-[119px] h-[119px] rounded-full bg-green-500 border-[#84CC16] border-[3px]">

                </div>
            </div>
            <div className="fields">
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
                    </form>
                </Form>
                <div className="registerBtn pt-3">
                        <Button type="submit" className="bg-[#84CC16] w-full flex">
                            Edit Profile
                        </Button>         
                    </div>
            </div>
            
        </div>
        <div className="appSettings w-[65%] flex bg-slate-800">

        </div>
      </div>
    </section>
  );
}
