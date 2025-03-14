import React, { SetStateAction, useEffect } from "react";
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
import {
  deleteTask,
  editTaskCompletedCycleStatus,
  editTaskStatus,
  finishFirstTask,
  getTasks,
  Task,
} from "@/lib/task-queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useCycleStore, Mode } from "@/app/stores/cycleStore";
import { usePomodoroStore } from "@/app/stores/pomodoroStore";
import { useTranslations } from "next-intl";
import {
  changeTimerStatusRequest,
  createTimerRequest,
  getOngoingTimerRequest,
} from "@/lib/time-queries";
import { useTaskStore } from "@/app/stores/taskStore";

const TaskList = () => {
  const queryClient = useQueryClient();
  const translations = useTranslations("components.task-list");

  const [isSpinning, setIsSpinning] = React.useState(false);
  const [AddTaskActive, setAddTaskActive] = React.useState("default");
  const [EditTaskActive, setEditTaskActive] = React.useState("default");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [completedCycles, setCompletedCycles] = React.useState<number>(0);

  const {
    currentMode,
    toNextMode,
    timeLeft,
    timerPaused,
    controlTimerPause,
    currentTimerId,
    setCurrentTimerId,
    cyclesFromLongBreak
  } = useCycleStore();

  const {
    tasks,
    addTask,
    newTasks,
    activeTask,
    setActiveTask
  } = useTaskStore();

  const [editInfo, setEditInfo] = React.useState({
    taskId: 0,
    taskTitle: "",
    taskDesc: "",
    taskDueDate: "",
    taskCycle: "",
    taskStatus: "",
  });

  // <-- delete task
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

  // Add a state to track the original order
  const [orderedTasks, setOrderedTasks] = React.useState<Task[]>([]);

  // <-- query fresh tasks
  const {
    data: fetchedTasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    // refetchOnWindowFocus: false,
  });
  // <-- update dependents of queried task list
  useEffect(() => {
    if (fetchedTasks) {
      // Sort tasks initially - completed tasks at bottom
      const sortedTasks = [...fetchedTasks].sort((a, b) => {
        if (a.status === "completed" && b.status !== "completed") return 1;
        if (b.status === "completed" && a.status !== "completed") return -1;
        return 0;
      });
      const unfinished = [...fetchedTasks.filter(t => t.status !== "completed")];
      newTasks(fetchedTasks);
      setActiveTask(fetchedTasks[0]);
      setOrderedTasks(sortedTasks);
    }
  }, [fetchedTasks]);

  // <-- complete the focused task
  const completeFirstListTask = useMutation({
    mutationFn: (taskId: number) => finishFirstTask(taskId),
    onMutate: async (taskId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old?.map((task) =>
          task.id === taskId ? { ...task, status: "completed" } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      // Revert on error
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.warning("Failed to mark task as completed");
    },
    onSettled: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const editCompletedCycleMutation = useMutation({
    mutationFn: ({
      id,
      completed_cycles,
    }: {
      id: number;
      completed_cycles: number;
    }) => editTaskCompletedCycleStatus(id, completed_cycles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  useEffect(() => {
    if (!activeTask) return;
    if (activeTask.estimated_cycles <= activeTask.completed_cycles + 1) {
      completeFirstListTask.mutate(activeTask.id);
      setActiveTask(tasks[1]);
    } else {
      editCompletedCycleMutation.mutate(
        {
          id: activeTask?.id,
          completed_cycles: activeTask.completed_cycles + 1
        }
      );
    }
  }, [cyclesFromLongBreak])

  const handleActionClick = (taskId: number) => {
    setIsSpinning(true);
    const targetTask = tasks.find(t => t.id === taskId);
    setActiveTask(targetTask ? targetTask : null);
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleEditClick = (
    taskId: number,
    taskTitle: string,
    taskDesc: string,
    taskDueDate: string,
    taskCycle: string,
    taskStatus: string
  ) => {
    setEditInfo({
      taskId,
      taskTitle,
      taskDesc,
      taskDueDate,
      taskCycle: taskCycle.toString(), // Convert number to string
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
    if (currentStatus === "completed") {
      editCompletedCycleMutation.mutate({
        id: taskId,
        completed_cycles: 0,
      });
    }
    // Optimistic update of local state
    // setTaskList(
    //   taskList.map((task) =>
    //     task.id === taskId ? { ...task, status: newStatus } : task
    //   )
    // );

    // Check if there are any pending tasks after the status change
    const hasUncompletedTasks = tasks.some((task) =>
      task.id === taskId
        ? newStatus !== "completed"
        : task.status !== "completed"
    );

    // Make API request to update status
    editStatusMutation.mutate({ id: taskId, status: newStatus });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update both states
    setOrderedTasks(items);
    newTasks(items);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full text-lg font-bold font-sans relative before:content-['Loading...'] before:block before:w-fit before:bg-[repeating-linear-gradient(90deg,currentColor_0_8%,transparent_0_10%)] before:bg-[200%_100%] before:bg-[length:200%_3px] before:bg-no-repeat before:animate-loading dark:text-[#A1A1AA] "></div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center w-full text-lg font-bold font-sans relative before:content-['Loading...'] before:block before:w-fit before:bg-[repeating-linear-gradient(90deg,currentColor_0_8%,transparent_0_10%)] before:bg-[200%_100%] before:bg-[length:200%_3px] before:bg-no-repeat before:animate-loading dark:text-[#A1A1AA]"></div>
    );

  return (
    <div id="task-list" className="p-6 w-full relative">
      {EditTaskActive === "editTitle" ? (
        <EditTask
          EditTaskActive={EditTaskActive}
          setEditTaskActive={setEditTaskActive}
          editInfo={{
            ...editInfo,
            taskCycle: editInfo.taskCycle.toString(),
          }}
          setEditInfo={setEditInfo}
          originalTask={tasks.find((task) => task.id === editInfo.taskId)!}
        />
      ) : AddTaskActive === "default" ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="iAmHere font-bold text-2xl text-[#52525B] dark:text-white">
                {translations("header")}
              </h1>
              <p className="text-[#71717A] font-normal text-base">
                {translations("subheader")}
              </p>
            </div>
            <div>
              <span className="h-6 w-6">🚀</span>
            </div>
          </div>
          <hr className="my-6 w-full border border-[#E4E4E7] dark:border-[#27272A]" />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided: any) => (
                <ScrollArea className="flex flex-col justify-between h-[340px] overflow-y-auto">
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-full"
                  >
                    {Array.isArray(orderedTasks) && orderedTasks.length > 0 ? (
                      orderedTasks.map((task, index) => (
                        <Draggable
                          key={task.id.toString()}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-6 ${
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
                            >
                              <div
                                className={`flex items-center justify-between ${
                                  index === 0 && task.status !== "completed"
                                    ? "bg-[#84CC161A] border border-[#84CC16]"
                                    : ""
                                }`}
                              >
                                <div className={`flex items-center gap-2 p-3`}>
                                  <Checkbox
                                    checked={task.status === "completed"}
                                    onCheckedChange={() =>
                                      handleCheckboxChange(task.id, task.status)
                                    }
                                    id={`task-${task.id}`}
                                    className="peer bg-[#F4F4F5] dark:bg-[white] border border-[#E4E4E7] dark:border-[#3F3F46]"
                                  />
                                  <span
                                    className={`${
                                      task.status === "completed"
                                        ? "line-through"
                                        : ""
                                    } ${
                                      index === 0 && task.status !== "completed"
                                        ? "text-[#84CC16]"
                                        : "text-[#71717A]"
                                    } text-base font-medium hover:underline cursor-pointer`}
                                    onClick={() =>
                                      handleEditClick(
                                        task.id,
                                        task.title,
                                        task.description,
                                        task.due_date,
                                        task.estimated_cycles.toString(),
                                        task.status
                                      )
                                    }
                                  >
                                    {task.title}
                                  </span>
                                </div>
                                <div
                                  className="burgerIcon flex items-center gap-4 p-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActionClick(task.id);
                                  }}
                                >
                                  {activeTask?.id === task.id && (
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
                                            task.estimated_cycles.toString(),
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
                                              {translations(
                                                "delete-task.header"
                                              )}
                                            </DialogTitle>
                                            <DialogDescription>
                                              {translations(
                                                "delete-task.message"
                                              )}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <DialogFooter>
                                            <Button
                                              variant="outline"
                                              onClick={() =>
                                                setIsDeleteDialogOpen(false)
                                              }
                                            >
                                              {translations(
                                                "delete-task.buttons.cancel.text"
                                              )}
                                            </Button>
                                            <Button
                                              className="bg-[#84CC16] hover:bg-[#669f10]"
                                              onClick={() =>
                                                handleDeleteClick(task.id)
                                              }
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
                                              {translations(
                                                "delete-task.buttons.confirm.text"
                                              )}
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  )}

                                  <span
                                    className={`${
                                      task.status === "completed"
                                        ? "hidden"
                                        : index === 0
                                        ? "text-[#84CC16]"
                                        : "text-[#71717A]"
                                    }
                                        `}
                                  >
                                    {" "}
                                    {task.completed_cycles}/
                                    {task.estimated_cycles}
                                  </span>

                                  <svg
                                    id="burger-menu-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className={`size-5 dark:text-[#71717A] hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full cursor-pointer transition-transform duration-500 ${
                                      activeTask?.id === task.id
                                        ? "rotate-[180deg]"
                                        : ""
                                    }
                                      `}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">
                          {translations("no-tasks-message")}
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                </ScrollArea>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            onClick={() => setAddTaskActive("addTitle")}
            id="add-task-button"
            className="w-full py-2 px-3 mt-16 text-sm font-semibold text-white bg-[#84CC16] hover:bg-[#669f10] rounded-md"
          >
            {translations("delete-task.buttons.add.text")}
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
