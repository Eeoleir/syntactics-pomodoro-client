import { create } from "zustand";
import { getTasks, Task } from "@/lib/task-queries";

type TasksState = {
  tasks: Task[];
  activeTask: Task | null
};

type TasksActions = {
  // initialize: (taskList: Task[]) => void;
  newTasks: (newTs: Task[]) => void;
  addTask: (newT: Task) => void;
  removeTask: (target: number) => void;
  setActiveTask: (task: Task | null) => void;
}

export const useTaskStore = create<TasksState & TasksActions>((set) => ({
  tasks: [],
  activeTask: null,
  // initialize: async () => {
  //   const newTasks: Task[] = await getTasks();
  //   if (newTasks) {
  //     set((state) => ({ tasks: newTasks }));
  //   } else {
  //     console.log(`fetch tasks err: ${newTasks}`)
  //   }
  // },
  newTasks: (newTs: Task[]) => set((state) => ({tasks: newTs})),
  addTask: (newTask: Task) => set((state) => ({tasks: [newTask, ...state.tasks]})),
  removeTask: (target: number) => set((state) => {
    return {tasks: state.tasks.filter(t => t.id !== target)}
  }),
  setActiveTask: (task: Task | null) => set((state) => ({activeTask: task})),
}))
