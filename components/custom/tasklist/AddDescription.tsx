import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

interface AddTaskProps {
  AddTaskActive: string;
  setAddTaskActive: React.Dispatch<React.SetStateAction<string>>;
}
const AddDescription: React.FC<AddTaskProps> = ({
  AddTaskActive,
  setAddTaskActive,
}) => {
  return (
    <div className="animate__animated animate__fadeIn flex flex-col justify-between h-[382px]">
      <div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
            onClick={() => setAddTaskActive("addTitle")}
          >
            <path
              strokeLinecap="round"
              strokeLinecap="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>

          <h3 className="text-2xl font-bold text-[#52525B]">Task Title</h3>
        </div>
        <Separator className="my-6" />

        <div className="mt-1">
          <Textarea placeholder="Type your description here." />
        </div>
        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <span className="font-medium text-base text-[#71717A]">
            Est. # of Pomodoro Cycle
          </span>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a number" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[...Array(10).keys()].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between items-center gap-6 mt-6">
        <Button
          onClick={() => setAddTaskActive("addTitle")}
          className="w-full font-semibold text-sm bg-[#A1A1AA] hover:bg-[#878790]"
        >
          Go Back
        </Button>
        <Button className="w-full bg-[#84CC16] hover:bg-[#669f10] font-semibold text-sm">
          Save Task
        </Button>
      </div>
    </div>
  );
};

export default AddDescription;
