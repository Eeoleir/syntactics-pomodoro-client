import API_BASE_URL from "@/lib/api_url";
import { useQuery } from "@tanstack/react-query";

import { toast } from "sonner";

export interface Tasks {
  id: number;
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
