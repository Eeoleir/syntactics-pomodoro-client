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

const TaskList = () => {
  const [activeTaskId, setActiveTaskId] = React.useState<number | null>(null);
  const [taskList, setTaskList] = React.useState<Task[]>([]);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [AddTaskActive, setAddTaskActive] = React.useState("default");
  const [EditTaskActive, setEditTaskActive] = React.useState("default");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [firstTask, setFirstTask] = React.useState<Task | null>(null);

  const [completedCycles, setCompletedCycles] = React.useState<number>(0);
  const currentMode = useCycleStore((state) => state.currentMode);
  const nextMode = useCycleStore((state) => state.nextMode);
  const [lastCompletedMode, setLastCompletedMode] = React.useState<Mode | null>(
    null
  );
  const setNoAvailableTasks = useCycleStore(
    (state) => state.setNoAvailableTasks
  );
  const noAvailableTasks = useCycleStore((state) => state.noAvailableTasks);
  const isTimerPaused = useCycleStore((state) => state.isTimerPaused);
  const setIsPaused = useCycleStore((state) => state.setIsPaused);
  const [timer_id, setTimerId] = React.useState<number | null>(null);
  const translations = useTranslations("components.task-list");

  const [editInfo, setEditInfo] = React.useState({
    taskId: 0,
    taskTitle: "",
    taskDesc: "",
    taskDueDate: "",
    taskCycle: "",
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

  // Add a state to track the original order
  const [orderedTasks, setOrderedTasks] = React.useState<Task[]>([]);

  useEffect(() => {
    if (fetchedTasks) {
      // Sort tasks initially - completed tasks at bottom
      const sortedTasks = [...fetchedTasks].sort((a, b) => {
        if (a.status === "completed" && b.status !== "completed") return 1;
        if (b.status === "completed" && a.status !== "completed") return -1;
        return 0;
      });
      setTaskList(sortedTasks);
      setOrderedTasks(sortedTasks);
    }
  }, [fetchedTasks]);

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

  const changeTimerStatusMutation = useMutation({
    mutationFn: ({
      status,
      timer_id,
      time_remaining,
    }: {
      status: string;
      timer_id: number;
      time_remaining: number;
    }) => changeTimerStatusRequest(status, timer_id, time_remaining),
    onSuccess: () => {
      toast.success("Timer paused successfully");
    },
    onError: (error) => {
      toast.error("Failed to pause timer");
      console.error("Timer pause error:", error);
    },
  });

  const createTimerMutation = useMutation({
    mutationFn: ({
      task_id,
      session_type,
      duration,
    }: {
      task_id: number;
      session_type: string;
      duration: number;
    }) => createTimerRequest(task_id, session_type, duration),
    onSuccess: (response) => {
      setTimerId(response.data.id);
      toast.success("Timer play successfully");
      console.log("Timer response:", response);
    },
    onError: (error) => {
      toast.error("Failed to play timer");
      console.error("Timer play error:", error);
    },
  });

  const getOngoingTimerMutation = useMutation({
    mutationFn: () => getOngoingTimerRequest(),
    onSuccess: (response) => {
      setTimerId(response.data.id);
      console.log("Timer response:", response);
    },
  });

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (taskList && taskList.length > 0) {
      const sortedTasks = [...taskList].sort((a, b) => {
        if (a.status === "completed" && b.status !== "completed") return 1;
        if (b.status === "completed" && a.status !== "completed") return -1;
        return 0;
      });
      const first = sortedTasks[0];
      setFirstTask({
        id: first.id,
        title: first.title,
        description: first.description,
        due_date: first.due_date,
        estimated_cycles: first.estimated_cycles,
        status: first.status,
        user_id: first.user_id,
      });
      if (!isTimerPaused) {
        getOngoingTimerMutation.mutate(undefined, {
          onSuccess: (response) => {
            if (response.data) {
              // There is an ongoing timer
              setTimerId(response.data.id);
              const mode =
                response.data.session_type === "focus"
                  ? Mode.FOCUS
                  : response.data.session_type === "short_break"
                  ? Mode.SHORT_BREAK
                  : Mode.LONG_BREAK;

              // Set the remaining time from the ongoing timer
              const timeRemaining =
                response.data.time_remaining ?? response.data.duration;
              console.log("Time remaining in useEffect:", timeRemaining);
              useCycleStore.getState().setTimeLeft(mode, timeRemaining);

              // changeTimerStatusMutation.mutate({
              //   status: "ongoing",
              //   timer_id: timer_id!,
              //   time_remaining: useCycleStore.getState().timeLeft[currentMode],
              // });
              console.log(
                "Time remaining after validation in get:",
                timeRemaining
              );
            } else {
              // No ongoing timer - create a new one
              createTimerMutation.mutate(
                {
                  task_id: first.id,
                  session_type:
                    currentMode === Mode.FOCUS
                      ? "focus"
                      : currentMode === Mode.SHORT_BREAK
                      ? "short_break"
                      : "long_break",
                  duration: Number(
                    currentMode === Mode.FOCUS
                      ? usePomodoroStore.getState().settings.focus_duration * 60
                      : currentMode === Mode.SHORT_BREAK
                      ? usePomodoroStore.getState().settings
                          .short_break_duration * 60
                      : usePomodoroStore.getState().settings
                          .long_break_duration * 60
                  ),
                },
                {
                  onSuccess: (response) => {
                    setTimerId(response.data.id);
                    console.log("Timer response in useEffect:", response);
                  },
                }
              );
            }
          },
          onError: (error) => {
            // Handle as if no ongoing timer
            createTimerMutation.mutate({
              task_id: first.id,
              session_type:
                currentMode === Mode.FOCUS
                  ? "focus"
                  : currentMode === Mode.SHORT_BREAK
                  ? "short_break"
                  : "long_break",
              duration: Number(
                currentMode === Mode.FOCUS
                  ? usePomodoroStore.getState().settings.focus_duration * 60
                  : currentMode === Mode.SHORT_BREAK
                  ? usePomodoroStore.getState().settings.short_break_duration *
                    60
                  : usePomodoroStore.getState().settings.long_break_duration *
                    60
              ),
            });
          },
        });
      } else if (isTimerPaused) {
        if (timer_id !== null) {
          changeTimerStatusMutation.mutate({
            status: "paused",
            timer_id: timer_id,
            time_remaining: 5,
          });
        }
      }

      // Only track cycles if task is not completed
      if (first.status !== "completed") {
        intervalId = setInterval(() => {
          // Check if we completed a full cycle (Focus + either type of break)
          if (
            currentMode === Mode.FOCUS &&
            (lastCompletedMode === Mode.SHORT_BREAK ||
              lastCompletedMode === Mode.LONG_BREAK)
          ) {
            setCompletedCycles((prev) => {
              const newCount = prev + 1;
              // Complete task when cycles match estimated_cycles
              if (newCount >= first.estimated_cycles) {
                completeFirstListTask.mutate(first.id);
                setIsPaused(true);

                return 0; // Reset counter after completion
              }
              return newCount;
            });
            setLastCompletedMode(null);
          } else if (
            currentMode === Mode.SHORT_BREAK ||
            currentMode === Mode.LONG_BREAK
          ) {
            setLastCompletedMode(currentMode);
          }
        }); // Check every second for mode changes
      } else {
        toast.success("All tasks completed!");
        setNoAvailableTasks(true);
      }
    } else {
      setFirstTask(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [taskList, currentMode, nextMode, lastCompletedMode, isTimerPaused]);

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

    // Optimistic update of local state
    setTaskList(
      taskList.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Check if there are any pending tasks after the status change
    const hasUncompletedTasks = taskList.some((task) =>
      task.id === taskId
        ? newStatus !== "completed"
        : task.status !== "completed"
    );

    // Update noAvailableTasks state based on whether there are any pending tasks
    setNoAvailableTasks(!hasUncompletedTasks);

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
    setTaskList(items);
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
          originalTask={taskList.find((task) => task.id === editInfo.taskId)!}
        />
      ) : AddTaskActive === "default" ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="iAmHere font-bold text-2xl text-[#52525B] dark:text-[#A1A1AA]">
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
                                    {index === 0 ? completedCycles : 0}/
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
                                      activeTaskId === task.id
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
                          No tasks found. Create a new task to get started!
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
