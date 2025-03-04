"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";

interface TimeDropdownProps {
  value: number;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function TimeDropdown({
  value,
  onValueChange,
  disabled = false,
}: TimeDropdownProps) {
  const { settings } = usePomodoroStore();
  const isDarkMode = settings.is_dark_mode;
  const timeOptions = [5, 10, 15, 20, 25, 30, 45, 60];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-[120px] justify-between ${
            isDarkMode
              ? "bg-[#3F3F46] text-white border-[#27272A]"
              : "bg-[#F4F4F5] text-black border-[#E4E4E7]"
          }`}
          disabled={disabled}
        >
          {value} mins{" "}
          <span className="ml-2">
            <HiMiniChevronUpDown />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-[120px] ${
          isDarkMode ? "bg-[#3F3F46] text-white" : "bg-white text-black"
        }`}
      >
        {timeOptions.map((minutes) => (
          <DropdownMenuItem
            key={minutes}
            onClick={() => onValueChange(`${minutes} mins`)}
            className={isDarkMode ? "hover:bg-[#52525B]" : "hover:bg-[#E4E4E7]"}
          >
            {minutes} mins
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
