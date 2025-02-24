import React from "react";

const TaskList = () => {
  return (
    <div className="flex flex-row w-1/2 border-l border-[#E4E4E7]">
      <div className="p-6 w-full relative">
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
          <div className="flex items-center gap-2 mb-6">
            <div className="checkbox h-5 w-5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-md"></div>
            <span className="text-[#71717A] text-base font-medium">Test</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="New Task"
            className="w-full border border-[#F4F4F5] rounded-md p-2"
          />
          <button className="py-2 px-3 text-base font-semibold text-white bg-[#84CC16] rounded-md ">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
