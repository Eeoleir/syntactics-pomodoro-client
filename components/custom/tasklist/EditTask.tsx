import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditTaskActiveProps {
  EditTaskActive: string; // Changed from EditTaskActive to match your state variable
  setEditTaskActive: React.Dispatch<React.SetStateAction<string>>; // Changed to match your state setter
}

const EditTaskActive: React.FC<EditTaskActiveProps> = ({
  EditTaskActive,
  setEditTaskActive,
}) => {
  return (
    <div className="flex flex-col justify-between h-[382px]">
      <div>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
            onClick={() => setEditTaskActive("default")}
          >
            <path
              strokeLinecap="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>

          <h3 className="text-2xl font-bold text-[#52525B]">
            What are you working on?
          </h3>
        </div>
        <Separator className="my-6" />

        <div className="flex flex-col gap-3 mt-1">
          <Input type="email" placeholder="Name of Task" />
          <Input type="email" placeholder="Description of your task" />
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
          onClick={() => setEditTaskActive("default")}
          className="w-full font-semibold text-sm bg-[#A1A1AA] hover:bg-[#878790]"
        >
          Cancel
        </Button>
        <Button
          onClick={() => setEditTaskActive("addDescription")}
          className="w-full bg-[#84CC16] hover:bg-[#669f10] font-semibold text-sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EditTaskActive;
