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
import { useEffect } from "react";
import {
  getPreferences,
  editPreference,
  createPreference,
  
} from "@/lib/preference-queries";
import { usePomodoroStore } from "@/app/stores/pomodoroStore"; 

const FormSchema = z.object({
  focusMin: z.number().default(25),
  shortBreakMin: z.number().default(5),
  longBreakMin: z.number().default(15),
  autoStartBreaks: z.boolean().default(false),
  autoStartFocus: z.boolean().default(false),
  autoCheckTasks: z.boolean().default(false),
  autoSwitchTasks: z.boolean().default(false),
});

export default function PomodoroSettings() {
  const { settings, setSettings } = usePomodoroStore();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      focusMin: settings.focus_duration,
      shortBreakMin: settings.short_break_duration,
      longBreakMin: settings.long_break_duration,
      autoStartBreaks: settings.is_auto_start_breaks,
      autoStartFocus: settings.is_auto_start_focus,
      autoCheckTasks: settings.is_auto_complete_tasks,
      autoSwitchTasks: settings.is_auto_switch_tasks,
    },
  });

  const userId = 2;

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const preferences = await getPreferences();
        console.log("Fetched Preferences:", preferences);
        if (preferences.length > 0) {
          const pref = preferences.find((p) => p.user_id === userId);
          if (pref) {
            
            setSettings({
              focus_duration: pref.focus_duration,
              short_break_duration: pref.short_break_duration,
              long_break_duration: pref.long_break_duration,
              cycles_before_long_break: pref.cycles_before_long_break,
              is_auto_start_breaks: pref.is_auto_start_breaks,
              is_auto_start_focus: pref.is_auto_start_focus,
              is_auto_complete_tasks: pref.is_auto_complete_tasks,
              is_auto_switch_tasks: pref.is_auto_switch_tasks,
              is_dark_mode: pref.is_dark_mode,
            });
           
            form.reset({
              focusMin: pref.focus_duration,
              shortBreakMin: pref.short_break_duration,
              longBreakMin: pref.long_break_duration,
              autoStartBreaks: pref.is_auto_start_breaks,
              autoStartFocus: pref.is_auto_start_focus,
              autoCheckTasks: pref.is_auto_complete_tasks,
              autoSwitchTasks: pref.is_auto_switch_tasks,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    };
    loadPreferences();
  }, [form, setSettings]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const preferences = await getPreferences();
      const existingPref = preferences.find((p) => p.user_id === userId);

      const updatedSettings = {
        focus_duration: data.focusMin,
        short_break_duration: data.shortBreakMin,
        long_break_duration: data.longBreakMin,
        cycles_before_long_break: 4, // Hardcoded as in original
        is_auto_start_breaks: data.autoStartBreaks,
        is_auto_start_focus: data.autoStartFocus,
        is_auto_complete_tasks: data.autoCheckTasks,
        is_auto_switch_tasks: data.autoSwitchTasks,
        is_dark_mode: settings.is_dark_mode, // Preserve existing dark mode
      };

      if (existingPref) {
        await editPreference(userId, updatedSettings);
      } else {
        await createPreference({
          user_id: userId,
          ...updatedSettings,
        });
      }

      // Update Zustand store with new settings
      setSettings(updatedSettings);

      console.log("Preferences saved successfully:", data);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
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
        <div className="form w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="titleSettings flex flex-row gap-[16px] mt-[12px] w-4/5 text-[16px] justify-between flex-wrap">
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
                <div className="flex flex-col w-4/5 gap-[8px]">
                  <FormField
                    control={form.control}
                    name="autoStartBreaks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm mt-2">
                        <div className="">
                          <FormLabel>Auto Start Breaks</FormLabel>
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
                          <FormLabel>Auto Start Focus</FormLabel>
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
                </div>
              </div>
              <div className="timer flex flex-row items-center gap-2 text-[#52525B] border-b-[1px] border-[#52525B] pb-2">
                <FaCheck className="size-[24px]" />
                <h3 className="text-[20px] font-[700]">Tasks</h3>
              </div>
              <div className="flex flex-col w-4/5 gap-[8px]">
                <FormField
                  control={form.control}
                  name="autoCheckTasks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm mt-2">
                      <div className="">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm">
                      <div className="">
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
                />
              </div>
              <div className="loginBtn flex-col gap-2 flex h-full pt-24 md:flex-row">
                <Button type="button" className="bg-[#71717A] w-full">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#84CC16] w-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
