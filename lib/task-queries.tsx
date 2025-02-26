import { error } from "console";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";

const token = "2|CYoaHb4o8dXc7B2oK4q0BAcsQJwp2jBnwkmDiStu56a04844";

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string; // Keeping it as a string since it's a date from the API
  estimated_cycles: number;
  status: "in_progress" | "completed" | "pending"; // Define possible statuses
  user_id: number;
}

export async function createTask(task: {
  title: string;
  description: string;
  due_date: string;
  estimated_cycles: number;
  status: string;
}) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return await response.json();
}

export async function deleteTask(taskId: number) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    toast.success("Task deleted successfully. 🎉");
  } else
    (error: Error) => {
      toast.warning(error.message);
    };

  return true;
}

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: Task[] = await response.json();
    toast.success("Tasks fetched successfully. 🎉");
    return data;
  } catch (error: any) {
    toast.warning(error.message || "Failed to fetch tasks");
    return [];
  }
}

export async function editTask(
  id: number,
  title: string,
  description: string,
  due_date: string,
  estimated_cycles: string,
  status: string
) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        due_date,
        estimated_cycles,
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }

    toast.success("Task updated successfully. 🎉");
    return data;
  } catch (error: any) {
    toast.warning(error.message);
    throw error;
  }
}

export async function editTaskStatus(id: number, status: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task status");
    }

    toast.success("Task status updated successfully. 🎉");
    return data;
  } catch (error: any) {
    toast.warning(error.message);
    throw error;
  }
}
