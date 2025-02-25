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
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";

interface EditTaskProps {
  EditTaskActive: string;
  setEditTaskActive: React.Dispatch<React.SetStateAction<string>>;
  editInfo: {
    taskId: number;
    taskTitle: string;
    taskDesc: string;
    taskCycle: number;
  };
  setEditInfo: React.Dispatch<
    React.SetStateAction<{
      taskId: number;
      taskTitle: string;
      taskDesc: string;
      taskCycle: number;
    }>
  >;
}
const EditTask: React.FC<EditTaskProps> = ({
  EditTaskActive,
  setEditTaskActive,
  editInfo,
  setEditInfo,
}) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const handlSubmitTask = () => {
    console.log("Task submitted");
    setEditTaskActive("default");
    toast("Task updated successfully. 🎉");
  };

  const handleGoBack = () => {
    setEditTaskActive("default");
    console.log("Go back");
  };
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
            onClick={() => setEditTaskActive("default")}
          >
            <path
              strokeLinecap="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>

          {isEditable ? (
            <Input
              type="text"
              placeholder=""
              className="w-fit"
              value={editInfo.taskTitle}
              onChange={(e) => {
                setEditInfo({
                  ...editInfo,
                  taskTitle: e.target.value,
                });
              }}
            />
          ) : (
            <h3 className="text-2xl font-bold text-[#52525B]">
              {editInfo.taskTitle}
            </h3>
          )}

          <img
            src="/editIcon.svg"
            alt="editIcon"
            onClick={() => setIsEditable(!isEditable)}
          />
        </div>
        <Separator className="my-6" />

        <div className="mt-1">
          <Textarea
            placeholder="Type your description here."
            disabled={!isEditable}
            value={editInfo.taskDesc}
            onChange={(e) => {
              setEditInfo({
                ...editInfo,
                taskDesc: e.target.value,
              });
            }}
          />
        </div>
        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <span className="font-medium text-base text-[#71717A]">
            Est. # of Pomodoro Cycle
          </span>
          <Input
            type="number"
            placeholder=""
            className="w-20"
            value={editInfo.taskCycle}
            onChange={(e) => {
              setEditInfo({
                ...editInfo,
                taskCycle: Number(e.target.value),
              });
            }}
            min="0"
          />
        </div>
      </div>
      <div className="flex justify-between items-center gap-6 mt-6">
        <Button
          onClick={(e) => handleGoBack()}
          className="w-full font-semibold text-sm bg-[#A1A1AA] hover:bg-[#878790]"
        >
          Go Back
        </Button>
        <Button
          onClick={() => {
            handlSubmitTask();
          }}
          className="w-full bg-[#84CC16] hover:bg-[#669f10] font-semibold text-sm"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditTask;
