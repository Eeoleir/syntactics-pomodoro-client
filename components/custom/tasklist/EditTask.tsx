import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { editTask } from "@/lib/task-queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditTaskProps {
  EditTaskActive: string;
  setEditTaskActive: React.Dispatch<React.SetStateAction<string>>;
  editInfo: {
    taskId: number;
    taskTitle: string;
    taskDesc: string;
    taskDueDate: string;
    taskCycle: string;
    taskStatus: string;
  };

  setEditInfo: React.Dispatch<
    React.SetStateAction<{
      taskId: number;
      taskTitle: string;
      taskDesc: string;
      taskDueDate: string;
      taskCycle: string;
      taskStatus: string;
    }>
  >;

  originalTask: {
    title: string;
    description: string;
    due_date: string;
    estimated_cycles: number;
    status: string;
  };
}
const EditTask: React.FC<EditTaskProps> = ({
  EditTaskActive,
  setEditTaskActive,
  editInfo,
  setEditInfo,
  originalTask,
}) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (taskData: {
      id: number;
      title: string;
      description: string;
      due_date: string;
      estimated_cycles: number;
      status: string;
    }) =>
      editTask(
        taskData.id,
        taskData.title,
        taskData.description,
        taskData.due_date,
        taskData.estimated_cycles,
        taskData.status
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditTaskActive("default");
    },
    onError: (error: any) => {
      toast.warning(error.message);
    },
  });

  const handleSubmitTask = () => {
    const changes: any = {
      id: editInfo.taskId,
    };

    // Compare with original task data and only include changed fields
    if (editInfo.taskTitle !== originalTask.title)
      changes.title = editInfo.taskTitle;
    if (editInfo.taskDesc !== originalTask.description)
      changes.description = editInfo.taskDesc;
    if (editInfo.taskDueDate !== originalTask.due_date)
      changes.due_date = editInfo.taskDueDate;
    if (editInfo.taskCycle !== originalTask.estimated_cycles.toString())
      changes.estimated_cycles = Number(editInfo.taskCycle);
    if (editInfo.taskStatus !== originalTask.status)
      changes.status = editInfo.taskStatus;

    editMutation.mutate(changes);
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
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 dark:text-[#A1A1AA] cursor-pointer"
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
              className="w-fit text-[#52525B] dark:text-[#A1A1AA]"
              value={editInfo.taskTitle}
              onChange={(e) => {
                setEditInfo({
                  ...editInfo,
                  taskTitle: e.target.value,
                });
              }}
            />
          ) : (
            <h3 className="text-2xl font-bold text-[#52525B] dark:text-[#A1A1AA]">
              {editInfo.taskTitle}
            </h3>
          )}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="blue"
            className="size-5 hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full "
            onClick={() => setIsEditable(!isEditable)}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>
        <Separator className="my-6" />

        <div className="mt-1">
          <Textarea
            placeholder="Type your description here."
            className="text-[#52525B] dark:text-[#A1A1AA]"
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
            className="w-20 text-[#52525B] dark:text-[#A1A1AA]"
            value={editInfo.taskCycle}
            disabled={!isEditable}
            onChange={(e) => {
              setEditInfo({
                ...editInfo,
                taskCycle: e.target.value,
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
            handleSubmitTask();
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
