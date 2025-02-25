"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import AddTask from "./AddTask";
import { Button } from "@/components/ui/button";
import AddDescription from "./AddDescription";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditTask from "./EditTask";
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

const TaskList = () => {
  const [isSpinning, setIsSpinning] = React.useState<boolean>(false);
  const [isActionOpen, setIsActionOpen] = React.useState<boolean>(false);
  const [AddTaskActive, setAddTaskActive] = React.useState<string>("default");
  const [EditTaskActive, setEditTaskActive] = React.useState<string>("default");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    React.useState<boolean>(false);

  const handleActionClick = () => {
    setIsSpinning(true);
    setIsActionOpen(!isActionOpen);
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleEditClick = () => {
    console.log("Edit clicked");
    setEditTaskActive("editTitle");
  };

  const handleDeleteClick = () => {
    console.log("Delete confirmed");
    setIsDeleteDialogOpen(false);
    toast("Task deleted successfully. 🗑️");
    // toast("Failed to delete task. Please try again. 🚨")
  };

  return (
    <div className="animate__animated animate__fadeIn flex flex-row w-1/2 border-l border-[#E4E4E7]">
      <div className="p-6 w-full relative">
        {EditTaskActive === "editTitle" ? (
          <EditTask
            EditTaskActive={EditTaskActive}
            setEditTaskActive={setEditTaskActive}
          />
        ) : AddTaskActive === "default" ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-2xl text-black">Task list</h1>
                <p className="text-[#71717A] font-normal text-base">
                  Your goals for this session
                </p>
              </div>
              <div>
                <span className="h-6 w-6">🚀</span>
              </div>
            </div>
            <hr className="my-6 w-full border border-[#E4E4E7]" />
            <div className="flex flex-col justify-between h-[382px]">
              <div className="flex justify-between overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <Checkbox />
                  <span className="text-[#71717A] text-base font-medium">
                    Test
                  </span>
                </div>
                <div
                  className="flex items-center gap-4"
                  onClick={handleActionClick}
                >
                  {isActionOpen && (
                    <div className="flex items-center gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="blue"
                        className="size-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick();
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
                              Are you sure you’re gonna delete this task?
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
                              onClick={handleDeleteClick}
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
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={`size-5 transition-transform duration-500 ${
                      isSpinning ? "rotate-[180deg]" : ""
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
              <Button
                onClick={() => setAddTaskActive("addTitle")}
                className="w-full py-2 px-3 text-sm font-semibold text-white bg-[#84CC16] hover:bg-[#669f10] rounded-md"
              >
                Add
              </Button>
            </div>
          </>
        ) : AddTaskActive === "addTitle" ? (
          <AddTask
            AddTaskActive={AddTaskActive}
            setAddTaskActive={setAddTaskActive}
          />
        ) : (
          AddTaskActive === "addDescription" && (
            <AddDescription
              AddTaskActive={AddTaskActive}
              setAddTaskActive={setAddTaskActive}
            />
          )
        )}
      </div>
    </div>
  );
};

export default TaskList;
