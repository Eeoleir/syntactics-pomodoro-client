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
  const timeOptions = [1, 5, 10, 15, 20, 25, 30, 45, 60];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[120px] justify-between bg-[#3F3F46] border-[1px] border-[#27272A]"
          disabled={disabled}
        >
          {value} mins{" "}
          <span className="ml-2">
            <HiMiniChevronUpDown />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[120px]">
        {timeOptions.map((minutes) => (
          <DropdownMenuItem
            key={minutes}
            onClick={() => onValueChange(`${minutes} mins`)}
          >
            {minutes} mins
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
