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


const formSchema = z.object({
  recoveryCode: z.string().min(4),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetCode() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recoveryCode: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form data:", values);
    router.push("/new-password");
  };

  return (
    <section className="content w-full h-screen mx-auto bg-[#18181B] text-[#FAFAFA] flex justify-center items-center flex-col">
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
              className=" text-left"
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

              <div className="Request-btn pt-6">
                <Button type="submit" className="bg-[#84CC16] w-full">
                    Continue
                </Button>      
              </div>
            </form>
          </Form>
        </div>
        <div className="links text-zinc-400 p-6 flex flex-col items-center text-sm space-y-1">
          <h3 className="flex flex-row gap-2">
            Didn’t receive an email? 
            <ResendTimer />
          </h3>
        </div>
      </div>
    </section>
  );
}