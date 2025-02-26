"use client";

import { Button } from "@/components/ui/button";
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { CiClock2 } from "react-icons/ci";
import { TimeDropdown } from "./dropdown_minutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaCheck } from "react-icons/fa6";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  focusMin: z.number().default(25),
  shortBreakMin: z.number().default(5),
  longBreakMin: z.number().default(15),
  autoStartBreaks: z.boolean().default(false).optional(),
  autoStartFocus: z.boolean().default(false).optional(),
  autoCheckTasks: z.boolean().default(false).optional(),
  autoSwitchTasks: z.boolean().default(false).optional(),
});

export default function PomodoroSettings() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      focusMin: 25,
      shortBreakMin: 5,
      longBreakMin: 15,
      autoStartBreaks: false,
      autoStartFocus: false,
      autoCheckTasks: false,
      autoSwitchTasks: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form submitted with values:", data);
  }

  return (
    <div className="appSettings w-full lg:w-2/3 flex border-[1px] border-[#27272A] flex-col p-4 sm:p-6 md:p-[24px] gap-3 md:gap-[12px] rounded-[12px] text-[#A1A1AA]">
      <div className="top flex flex-row items-center justify-between w-full h-auto">
        <h2 className="text-[24px] font-[700]">Pomodoro Settings</h2>
        <Button
          className="pencil ml-auto bg-[#84CC16] p-3 rounded-[12px] h-fit text-white"
          onClick={form.handleSubmit(onSubmit)}
        >
          <PiPencilSimpleLineDuotone className="size-4" />
        </Button>
      </div>
      <div className="timerSettings">
        <div className="timer flex flex-row items-center gap-2 text-[#52525B] border-b-[1px] border-[#52525B] pb-2">
          <CiClock2 className="size-[24px]" />
          <h3 className="text-[20px] font-[700]">Timer</h3>
        </div>
        <div className="form w-1/2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="titleSettings flex flex-row gap-[16px] mt-[12px] w-full text-[16px] justify-between">
                <FormField
                  control={form.control}
                  name="focusMin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-[8px]">
                      <FormLabel>Focus</FormLabel>
                      <FormControl>
                        <TimeDropdown
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value.replace(" mins", "")))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortBreakMin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-[8px]">
                      <FormLabel>Short Break</FormLabel>
                      <FormControl>
                        <TimeDropdown
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value.replace(" mins", "")))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longBreakMin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-[8px]">
                      <FormLabel>Long Break</FormLabel>
                      <FormControl>
                        <TimeDropdown
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value.replace(" mins", "")))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="autoSettings">
                <div className=" flex flex-col w-full gap-[8px]">
                  <FormField
                    control={form.control}
                    name="autoStartBreaks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg  shadow-sm mt-2">
                        <div className="">
                          <FormLabel>Auto start Breaks</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autoStartFocus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                        <div className="">
                          <FormLabel>Auto start Focus</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longBreakMin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-[8px] justify-between">
                        <FormLabel>Long Break Interval</FormLabel>
                        <FormControl className="flex ml-auto">
                          <TimeDropdown
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(
                                parseInt(value.replace(" mins", ""))
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                  control={form.control}
                  name="autoCheckTasks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Auto Check Tasks</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="autoSwitchTasks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Auto Switch Tasks</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                </div>
              </div>
              <div className="timer flex flex-row items-center gap-2 text-[#52525B] border-b-[1px] border-[#52525B] pb-2">
                <FaCheck className="size-[24px]" />
                <h3 className="text-[20px] font-[700]">Tasks</h3>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
