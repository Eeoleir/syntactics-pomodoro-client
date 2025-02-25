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
import Link from "next/link";


const formSchema = z
  .object({
    password: z.string().min(6),
    repassword: z.string().min(6),
  })
  .refine((data) => data.password === data.repassword, {
    path: ["repassword"],
  });

  type FormValues = z.infer<typeof formSchema>;

export default function NewPassword() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      repassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form data:", values);
    router.push("/login");
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
            Please create a new password that you don’t use  on any other site.
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
                  </FormItem>
                )}
              />
              <div className="Request-btn pt-3 pb-6">
                <Button type="submit" className="bg-[#84CC16] w-full">
                  Continue
                </Button>
              </div>
            </form>

            
          </Form>
        </div>
        
      </div>
    </section>
  );
}