import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import AddTask from "./AddTask";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import EditTask from "./EditTask";
import { deleteTask, editTaskStatus, getTasks, Task } from "@/lib/task-queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const TaskList = () => {
  const [activeTaskId, setActiveTaskId] = React.useState<number | null>(null);
  const [taskList, setTaskList] = React.useState<Task[]>([]);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [AddTaskActive, setAddTaskActive] = React.useState("default");
  const [EditTaskActive, setEditTaskActive] = React.useState("default");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const [editInfo, setEditInfo] = React.useState({
    taskId: 0,
    taskTitle: "",
    taskDesc: "",
    taskDueDate: "",
    taskCycle: 0,
    taskStatus: "",
  });

  const {
    data: fetchedTasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.warning(`Failed to delete task: ${error.message}`);
    },
  });

  useEffect(() => {
    if (fetchedTasks) {
      setTaskList(fetchedTasks);
    }
  }, [fetchedTasks]);

  const handleActionClick = (taskId: number) => {
    setIsSpinning(true);
    setActiveTaskId(activeTaskId === taskId ? null : taskId);
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleEditClick = (
    taskId: number,
    taskTitle: string,
    taskDesc: string,
    taskDueDate: string,
    taskCycle: number,
    taskStatus: string
  ) => {
    setEditInfo({
      taskId,
      taskTitle,
      taskDesc,
      taskDueDate,
      taskCycle,
      taskStatus,
    });
    setEditTaskActive("editTitle");
  };

  const handleDeleteClick = (taskId: number) => {
    deleteMutation.mutate(taskId);
  };

  const editStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      editTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.warning(error.message);
    },
  });

  const handleCheckboxChange = (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    // Optimistic update of local state
    setTaskList(
      taskList.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Make API request to update status
    editStatusMutation.mutate({ id: taskId, status: newStatus });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full text-lg font-bold font-sans relative before:content-['Loading...'] before:block before:w-fit before:bg-[repeating-linear-gradient(90deg,currentColor_0_8%,transparent_0_10%)] before:bg-[200%_100%] before:bg-[length:200%_3px] before:bg-no-repeat before:animate-loading"></div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center w-full text-lg font-bold font-sans relative before:content-['Loading...'] before:block before:w-fit before:bg-[repeating-linear-gradient(90deg,currentColor_0_8%,transparent_0_10%)] before:bg-[200%_100%] before:bg-[length:200%_3px] before:bg-no-repeat before:animate-loading"></div>
    );

  return (
    <div id="task-list" className="p-6 w-full relative">
      {EditTaskActive === "editTitle" ? (
        <EditTask
          EditTaskActive={EditTaskActive}
          setEditTaskActive={setEditTaskActive}
          editInfo={editInfo}
          setEditInfo={setEditInfo}
        />
      ) : AddTaskActive === "default" ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="iAmHere font-bold text-2xl text-[#52525B] dark:text-[#A1A1AA]">
                Task list
              </h1>
              <p className="text-[#71717A] font-normal text-base">
                Your goals for this session
              </p>
            </div>
            <div>
              <span className="h-6 w-6">🚀</span>
            </div>
          </div>
          <hr className="my-6 w-full border border-[#E4E4E7] dark:border-[#27272A]" />

          <ScrollArea className="flex flex-col justify-between h-[382px] overflow-y-auto">
            {Array.isArray(taskList) && taskList.length > 0 ? (
              taskList.map((task) => (
                <div key={task.id} className="flex justify-between mx-3">
                  <div className="flex items-center gap-2 mb-6">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={() =>
                        handleCheckboxChange(task.id, task.status)
                      }
                      id={`task-${task.id}`}
                      className="peer bg-[#F4F4F5] dark:bg-[#27272A] border border-[#E4E4E7] dark:border-[#3F3F46] 
             peer-checked:bg-blue-500 peer-checked:border-blue-500"
                    >
                      <svg
                        className="hidden peer-checked:block w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="blue"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Checkbox>
                    <span
                      className={`${
                        task.status === "completed" ? "line-through" : ""
                      } text-[#71717A] text-base font-medium hover:underline cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(
                          task.id,
                          task.title,
                          task.description,
                          task.due_date,
                          task.estimated_cycles,
                          task.status
                        );
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div
                    className="burgerIcon flex items-center gap-4"
                    onClick={() => handleActionClick(task.id)}
                  >
                    {activeTaskId === task.id && (
                      <div className="flex items-center gap-4">
                        <svg
                          id="edit-task-button"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="blue"
                          className="size-5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(
                              task.id,
                              task.title,
                              task.description,
                              task.due_date,
                              task.estimated_cycles,
                              task.status
                            );
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>

                        <Dialog
                          open={isDeleteDialogOpen}
                          onOpenChange={setIsDeleteDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <svg
                              id="delete-task-button"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="red"
                              className="size-5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you sure you're gonna delete this task ?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your task..
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                No, don't delete my task
                              </Button>
                              <Button
                                className="bg-[#84CC16] hover:bg-[#669f10]"
                                onClick={() => handleDeleteClick(task.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                                Yes, delete my task
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    <svg
                      id="burger-menu-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={`size-5 dark:text-[#71717A] hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full cursor-pointer transition-transform duration-500 ${
                        activeTaskId === task.id ? "rotate-[180deg]" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">
                  No tasks found. Create a new task to get started!
                </p>
              </div>
            )}
          </ScrollArea>
          <Button
            onClick={() => setAddTaskActive("addTitle")}
            id="add-task-button"
            className="w-full py-2 px-3 mt-16 text-sm font-semibold text-white bg-[#84CC16] hover:bg-[#669f10] rounded-md"
          >
            Add
          </Button>
        </>
      ) : AddTaskActive === "addTitle" ? (
        <AddTask
          AddTaskActive={AddTaskActive}
          setAddTaskActive={setAddTaskActive}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TaskList;
