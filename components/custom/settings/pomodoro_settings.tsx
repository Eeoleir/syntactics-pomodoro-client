"use client";

import { Button } from "@/components/ui/button";
import { PiPencilSimpleLineDuotone } from "react-icons/pi";
import { CiClock2 } from "react-icons/ci";
import { TimeDropdown } from "./dropdown_minutes";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react"; // Added useEffect
import PomodoroDataProvider from "@/components/hooks/fetchPreference";
import { useTranslations } from "next-intl";

interface PomodoroFormData {
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  cycles: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  autoCheckTasks: boolean;
  autoSwitchTasks: boolean;
}

function PomodoroSettingsComponent({
  settings,
  userId,
  isLoading,
  error,
  updateSettings,
}: {
  settings: any;
  userId: number | null;
  isLoading: boolean;
  error: Error | null;
  updateSettings: (data: Partial<any>) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const translations = useTranslations('components.pomodoro-settings')

  const form = useForm<PomodoroFormData>({
    defaultValues: {
      focusMin: settings.focus_duration,
      shortBreakMin: settings.short_break_duration,
      longBreakMin: settings.long_break_duration,
      cycles: settings.cycles_before_long_break,
      autoStartBreaks: settings.is_auto_start_breaks,
      autoStartFocus: settings.is_auto_start_focus,
      autoCheckTasks: settings.is_auto_complete_tasks,
      autoSwitchTasks: settings.is_auto_switch_tasks,
    },
  });

  // Update form values when settings change
  useEffect(() => {
    form.reset({
      focusMin: settings.focus_duration,
      shortBreakMin: settings.short_break_duration,
      longBreakMin: settings.long_break_duration,
      cycles: settings.cycles_before_long_break,
      autoStartBreaks: settings.is_auto_start_breaks,
      autoStartFocus: settings.is_auto_start_focus,
      autoCheckTasks: settings.is_auto_complete_tasks,
      autoSwitchTasks: settings.is_auto_switch_tasks,
    });
  }, [form, settings]); // Depend on settings so it updates when settings change

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    form.reset({
      focusMin: settings.focus_duration,
      shortBreakMin: settings.short_break_duration,
      longBreakMin: settings.long_break_duration,
      cycles: settings.cycles_before_long_break,
      autoStartBreaks: settings.is_auto_start_breaks,
      autoStartFocus: settings.is_auto_start_focus,
      autoCheckTasks: settings.is_auto_complete_tasks,
      autoSwitchTasks: settings.is_auto_switch_tasks,
    });
  };

  async function onSubmit(data: PomodoroFormData) {
    if (!userId) {
      console.error("No user ID available");
      return;
    }

    try {
      const updatedSettings = {
        focus_duration: data.focusMin,
        short_break_duration: data.shortBreakMin,
        long_break_duration: data.longBreakMin,
        cycles_before_long_break: data.cycles,
        is_auto_start_breaks: data.autoStartBreaks,
        is_auto_start_focus: data.autoStartFocus,
        is_auto_complete_tasks: data.autoCheckTasks,
        is_auto_switch_tasks: data.autoSwitchTasks,
      };

      await updateSettings(updatedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="appSettings w-full lg:w-2/3 flex border-[1px] border-[#27272A] flex-col p-4 sm:p-6 md:p-[24px] gap-3 md:gap-[12px] rounded-[12px] text-[#A1A1AA]">
      <div className="top flex flex-row items-center justify-between w-full h-auto">
        <h2 className="text-[24px] font-[700]">{translations('header')}</h2>
        {!isEditing && (
          <Button
            className="pencil ml-auto bg-[#84CC16] p-3 rounded-[12px] h-fit text-white"
            onClick={handleEditClick}
          >
            <PiPencilSimpleLineDuotone className="size-4" />
          </Button>
        )}
      </div>
      <div className="timerSettings">
        <div className="timer flex flex-row items-center gap-2 text-[#52525B] border-b-[1px] border-[#52525B] pb-2">
          <CiClock2 className="size-[24px]" />
          <h3 className="text-[20px] font-[700]">{translations('timer.title')}</h3>
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
                      <FormLabel>{translations('timer.fields.focus.title')}</FormLabel>
                      <FormControl>
                        <TimeDropdown
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value.replace(` ${translations('timer.fields.focus.mins')}`, "")))
                          }
                          disabled={!isEditing}
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
                      <FormLabel>{translations('timer.fields.short-break.title')}</FormLabel>
                      <FormControl>
                        <TimeDropdown
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value.replace(` ${translations('timer.fields.short-break.mins')}`, "")))
                          }
                          disabled={!isEditing}
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
                      <FormLabel>{translations('timer.fields.long-break.title')}</FormLabel>
                      <FormControl>
                        <TimeDropdown
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(parseInt(value.replace(` ${translations('timer.fields.long-break.mins')}`, "")))
                          }
                          disabled={!isEditing}
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
                        <div>
                          <FormLabel>{translations('timer.fields.auto-start-breaks.title')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!isEditing}
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
                        <div>
                          <FormLabel>{translations('timer.fields.auto-start-focus.title')}</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cycles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-[8px] justify-between">
                        <FormLabel>{translations('timer.fields.cycles-before-long-break.title')}</FormLabel>
                        <FormControl className="flex ml-auto">
                          <select
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            className="bg-[#27272A] text-white p-2 rounded-[8px]"
                            disabled={!isEditing}
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="timer flex flex-row items-center gap-2 text-[#52525B] border-b-[1px] border-[#52525B] pb-2">
                <FaCheck className="size-[24px]" />
                <h3 className="text-[20px] font-[700]">{translations('tasks.title')}</h3>
              </div>
              <div className="flex flex-col w-4/5 gap-[8px]">
                <FormField
                  control={form.control}
                  name="autoCheckTasks"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg shadow-sm mt-2">
                      <div>
                        <FormLabel>{translations('tasks.fields.auto-check-tasks.title')}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
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
                      <div>
                        <FormLabel>{translations('tasks.fields.auto-switch-tasks.title')}</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {isEditing && (
                <div className="loginBtn flex-col gap-2 flex h-full pt-24 md:flex-row">
                  <Button
                    type="button"
                    className="bg-[#71717A] w-full"
                    onClick={handleCancelClick}
                  >
                    {translations('buttons.cancel.text')}
                  </Button>
                  <Button type="submit" className="bg-[#84CC16] w-full">
                    {translations('buttons.submit-changes.text')}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function PomodoroSettings() {
  return (
    <PomodoroDataProvider>
      {({ settings, userId, isLoading, error, updateSettings }) => (
        <PomodoroSettingsComponent
          settings={settings}
          userId={userId}
          isLoading={isLoading}
          error={error}
          updateSettings={updateSettings}
        />
      )}
    </PomodoroDataProvider>
  );
}
