"use client";
import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import AddTask from "./AddTask";
import { Button } from "@/components/ui/button";
import AddDescription from "./EditTask";
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
import "animate.css";
import EditTask from "./EditTask";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const TaskList = () => {
  const [activeTaskId, setActiveTaskId] = React.useState<number | null>(null);
  const [taskList, setTaskList] = React.useState([
    {
      id: 1,
      title: "React Dashboard",
      description: "Develop a user dashboard",
      due_date: "2025-02-28",
      estimated_cycles: 7,
      status: "pending",
      user_id: 101,
    },
    {
      id: 2,
      title: "Laravel Project",
      description: "Test231",
      due_date: "2025-03-01",
      estimated_cycles: 5,
      status: "in_progress",
      user_id: 102,
    },
    {
      id: 3,
      title: "API Integration",
      description: "Integrate third-party API",
      due_date: "2025-03-05",
      estimated_cycles: 8,
      status: "completed",
      user_id: 103,
    },
    {
      id: 4,
      title: "Database Optimization",
      description: "Optimize DB queries",
      due_date: "2025-03-10",
      estimated_cycles: 6,
      status: "in_progress",
      user_id: 104,
    },
    {
      id: 5,
      title: "UI/UX Enhancement",
      description: "Improve UI responsiveness",
      due_date: "2025-03-12",
      estimated_cycles: 4,
      status: "pending",
      user_id: 105,
    },
    {
      id: 6,
      title: "Security Patch",
      description: "Fix vulnerabilities",
      due_date: "2025-03-15",
      estimated_cycles: 3,
      status: "completed",
      user_id: 106,
    },
    {
      id: 7,
      title: "Testing & Debugging",
      description: "Perform end-to-end testing",
      due_date: "2025-03-18",
      estimated_cycles: 10,
      status: "in_progress",
      user_id: 107,
    },
    {
      id: 8,
      title: "Server Migration",
      description: "Move application to new server",
      due_date: "2025-03-20",
      estimated_cycles: 9,
      status: "pending",
      user_id: 108,
    },
    {
      id: 9,
      title: "Bug Fixing",
      description: "Resolve reported issues",
      due_date: "2025-03-22",
      estimated_cycles: 5,
      status: "in_progress",
      user_id: 109,
    },
    {
      id: 10,
      title: "Documentation Update",
      description: "Update project documentation",
      due_date: "2025-03-25",
      estimated_cycles: 2,
      status: "completed",
      user_id: 110,
    },
    {
      id: 11,
      title: "Frontend Refactor",
      description: "Refactor React components",
      due_date: "2025-03-28",
      estimated_cycles: 6,
      status: "pending",
      user_id: 111,
    },
    {
      id: 12,
      title: "Backend API Revamp",
      description: "Improve API efficiency",
      due_date: "2025-04-01",
      estimated_cycles: 7,
      status: "in_progress",
      user_id: 112,
    },
    {
      id: 13,
      title: "Data Analytics Module",
      description: "Develop analytics dashboard",
      due_date: "2025-04-05",
      estimated_cycles: 8,
      status: "completed",
      user_id: 113,
    },
    {
      id: 14,
      title: "User Authentication",
      description: "Implement OAuth and JWT",
      due_date: "2025-04-08",
      estimated_cycles: 5,
      status: "pending",
      user_id: 114,
    },
    {
      id: 15,
      title: "Notification System",
      description: "Add real-time notifications",
      due_date: "2025-04-12",
      estimated_cycles: 6,
      status: "in_progress",
      user_id: 115,
    },
    {
      id: 16,
      title: "Performance Tuning",
      description: "Improve app performance",
      due_date: "2025-04-15",
      estimated_cycles: 4,
      status: "completed",
      user_id: 116,
    },
    {
      id: 17,
      title: "Multi-Language Support",
      description: "Add i18n support",
      due_date: "2025-04-18",
      estimated_cycles: 5,
      status: "pending",
      user_id: 117,
    },
    {
      id: 18,
      title: "DevOps Setup",
      description: "Set up CI/CD pipeline",
      due_date: "2025-04-22",
      estimated_cycles: 7,
      status: "in_progress",
      user_id: 118,
    },
    {
      id: 19,
      title: "Customer Feedback System",
      description: "Implement user feedback module",
      due_date: "2025-04-25",
      estimated_cycles: 5,
      status: "completed",
      user_id: 119,
    },
    {
      id: 20,
      title: "Dark Mode Implementation",
      description: "Add dark mode feature",
      due_date: "2025-04-28",
      estimated_cycles: 3,
      status: "pending",
      user_id: 120,
    },
  ]);
  const [isSpinning, setIsSpinning] = React.useState<boolean>(false);
  const [AddTaskActive, setAddTaskActive] = React.useState<string>("default");
  const [EditTaskActive, setEditTaskActive] = React.useState<string>("default");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    React.useState<boolean>(false);

  const [editInfo, setEditInfo] = React.useState({
    taskId: 0,
    taskTitle: "",
    taskDesc: "",
    taskCycle: 0,
  });

  const handleActionClick = (taskId: number) => {
    setIsSpinning(true);
    setActiveTaskId(activeTaskId === taskId ? null : taskId);
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleEditClick = (
    taskId: number,
    taskTitle: string,
    taskDesc: string,
    taskCycle: number
  ) => {
    setEditInfo({
      taskId: taskId,
      taskTitle: taskTitle,
      taskDesc: taskDesc,
      taskCycle: taskCycle,
    });
    setEditTaskActive("editTitle");
  };

  const handleDeleteClick = (taskTitle: string) => {
    console.log("Delete confirmed");
    setIsDeleteDialogOpen(false);
    toast(`Task "${taskTitle}" deleted successfully. 🗑️`);
    // toast("Failed to delete task. Please try again. 🚨")
  };

  const handleCheckboxChange = (taskId: number) => {
    setTaskList(
      taskList.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    );
  };

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
              <h1 className="iAmHere font-bold text-2xl text-black">
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
          <hr className="my-6 w-full border border-[#E4E4E7]" />

          <ScrollArea className="flex flex-col justify-between h-[382px] overflow-y-auto">
            {taskList.map((task) => (
              <div key={task.id} className="flex justify-between mx-3">
                <div className="flex items-center gap-2 mb-6">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={() => handleCheckboxChange(task.id)}
                    id={`task-${task.id}`}
                    className="bg-[#F4F4F5] border border-[#E4E4E7]"
                  />
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
                        task.estimated_cycles
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
                        className="size-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(
                            task.id,
                            task.title,
                            task.description,
                            task.estimated_cycles
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
                            className="size-5 cursor-pointer"
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
                              Are you sure you’re gonna delete this task ?
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
                              No, don’t delete my task
                            </Button>
                            <Button
                              className="bg-[#84CC16] hover:bg-[#669f10]"
                              onClick={() => handleDeleteClick(task.title)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  strokeLinecap="round"
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
                    className={`size-5 transition-transform duration-500 ${
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
            ))}
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
