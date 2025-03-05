import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";

import { toast } from "sonner";
import API_BASE_URL from "./api_url";

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  estimated_cycles: number;
  status: "in_progress" | "completed" | "pending";
  user_id: number;
}

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;

  return Cookies.get("token") || null;
}

export async function createTask(task: {
  title: string;
  description: string;
  due_date: string;
  estimated_cycles: number;
  status: string;
}) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}tasks`, {
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
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    toast.success("Task deleted successfully.  ");
  } else {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete task");
  }

  return true;
}

export async function getTasks(): Promise<Task[]> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  try {
    const response = await fetch(`${API_BASE_URL}tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const responseData: { data: Task[] } = await response.json();
    toast.success("Tasks fetched successfully.  ");
    return responseData.data;
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
  estimated_cycles: number,
  status: string
) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  // Create an object with only the changed fields
  const updateData: any = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (due_date) updateData.due_date = due_date;
  if (estimated_cycles) updateData.estimated_cycles = estimated_cycles;
  if (status) updateData.status = status;

  try {
    const response = await fetch(`${API_BASE_URL}tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    toast.success("Task updated successfully.  ");
    return data;
  } catch (error: any) {
    toast.warning(error.message);
    throw error;
  }
}

export async function editTaskStatus(id: number, status: string) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  try {
    const response = await fetch(`${API_BASE_URL}tasks/${id}`, {
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

    toast.success("Task status updated successfully.  ");
    return data;
  } catch (error: any) {
    toast.warning(error.message);
    throw error;
  }
}

export async function finishFirstTask(id: number) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  try {
    const response = await fetch(`${API_BASE_URL}tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "completed",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete task");
    }

    toast.success("Task marked as completed!  ");
    return data;
  } catch (error: any) {
    toast.warning(error.message);
    throw error;
  }
}
