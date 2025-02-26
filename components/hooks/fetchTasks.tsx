import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "../apiConfig/apiConfig";
import { toast } from "sonner";

export interface Tasks {
  title: number;
  description: string;
  due_date: string;
  estimated_cycles: number;
  status: string;
}

const fetchTasks = async (): Promise<Tasks[]> => {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  if (!res.ok) {
    toast.error("Failed to fetch tasks. Please try again. 🚨");
  }
  return res.json();
};

export const createTask = () => {
  return useQuery<Tasks[], Error>({
    queryKey: ["create-tasks"], // Cache key
    queryFn: fetchTasks,
  });
};
