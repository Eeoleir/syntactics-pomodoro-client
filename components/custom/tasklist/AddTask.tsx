import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/lib/task-queries";
import { useTranslations } from "next-intl";

interface AddTaskProps {
  AddTaskActive: string;
  setAddTaskActive: React.Dispatch<React.SetStateAction<string>>;
}

const AddTask: React.FC<AddTaskProps> = ({ setAddTaskActive }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [pomodoroCycles, setPomodoroCycles] = useState("");
  const queryClient = useQueryClient();
  const componentTranslations = useTranslations('components.add-task');

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Match TaskList query key
      toast.success("Task created successfully!");
      setTaskName("");
      setTaskDescription("");
      setPomodoroCycles("");
      setAddTaskActive("default");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  const handleSubmitTask = () => {
    if (!taskName || !taskDescription || !pomodoroCycles) {
      toast.error("All fields are required.");
      return;
    }
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const newTask = {
      title: taskName,
      description: taskDescription,
      due_date: formattedDate,
      estimated_cycles: parseInt(pomodoroCycles, 10),
      status: "pending",
    };

    mutation.mutate(newTask);
  };

  return (
    <div className="animate__animated animate__fadeIn flex flex-col justify-between h-[382px]">
      <div>
        <div className="flex items-center gap-2">
          <svg
            onClick={() => setAddTaskActive("default")}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 dark:text-[#A1A1AA] cursor-pointer"
          >
            <path
              strokeLinecap="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          <h3 className="text-2xl font-bold text-[#52525B] dark:text-[#A1A1AA]">
            {componentTranslations('header')}
          </h3>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-3 mt-1">
          <Input
            type="text"
            placeholder={componentTranslations('fields.task-name.placeholder')}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="text-[#52525B] dark:text-[#A1A1AA] placeholder:text-[#52525B] dark:placeholder:text-[#52525B]"
          />
          <Input
            type="text"
            placeholder={componentTranslations('fields.task-description.placeholder')}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="text-[#52525B] dark:text-[#A1A1AA] placeholder:text-[#52525B] dark:placeholder:text-[#52525B]"
          />
        </div>
        <Separator className="my-6" />
        <div className="flex items-center justify-between">
          <span className="font-medium text-base text-[#71717A]">
            {componentTranslations('fields.est-pomodoro-cycle.title')}
          </span>
          <Input
            type="number"
            placeholder="0"
            min="1"
            value={pomodoroCycles}
            onChange={(e) => setPomodoroCycles(e.target.value)}
            className="w-20 text-[#52525B] dark:text-[#A1A1AA] placeholder:text-[#52525B] dark:placeholder:text-[#52525B]"
          />
        </div>
      </div>
      <div className="flex justify-between items-center gap-6 mt-6">
        <Button
          onClick={() => setAddTaskActive("default")}
          className="w-full font-semibold text-[#FAFAFA] text-sm bg-[#A1A1AA] hover:bg-[#878790]"
        >
          {componentTranslations('buttons.cancel.text')}
        </Button>
        <Button
          onClick={handleSubmitTask}
          className="w-full bg-[#84CC16] hover:bg-[#669f10] text-[#FAFAFA] font-semibold text-sm"
          disabled={!taskName || !taskDescription || !pomodoroCycles}
        >
          {componentTranslations('buttons.submit.text')}
        </Button>
      </div>
    </div>
  );
};

export default AddTask;
