"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

import {
  Form,
  FormControl,
  FormField,
  FormItem,

} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type FormValues = z.infer<typeof formSchema>;


export default function forgotPassword() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form data:", values);
    router.push("/reset-code");

  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center">
      
      <div className="flex h-[275px] w-[408px] border-[1px] rounded-xl bg-[#18181B] border-[#84CC16] flex-col">
      <div className="title flex flex-row h-auto p-6 pb-0 items-center gap-[10px] cursor-pointer" onClick={() => router.back()}>
          <IoArrowBack className="text-[20px] text-zinc-400" />
          <p className="text-[14px] mt-1 text-zinc-400 font-normal">Go back</p>
      </div>
        <div className="form text-[14px] p-6 pb-0 pt-4">
          <div className="text pb-6">
            <h2 className="text-2xl font-semibold">Forgot Password</h2>
            <p className="text-zinc-400">Enter you email address</p>
          </div>
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
                    <FormControl>
                      <Input
                        required
                        className="w-full bg-[#3D4142] border-none px-3 py-1"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
             
              <div className="Request-btn pt-5">
                <Button type="submit" className="bg-[#84CC16] w-full">
                  Request reset code
                </Button>
              </div>
            </form>
          </Form>
        </div>
       
      </div>
    </section>
  );
}
