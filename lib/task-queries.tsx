import { error } from "console";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";

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
      Authorization: `Bearer 9|Jxwrz7UWjpEkKPcuQLDUSaGnyEFM87kFv6cFTc3q99a008e6`,
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return await response.json();
}

export async function deleteTask(taskId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
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

  toast.success("Task deleted successfully.");
  return true;
}

export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 9|Jxwrz7UWjpEkKPcuQLDUSaGnyEFM87kFv6cFTc3q99a008e6`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    toast.success("Tasks fetched successfully. 🎉");
    return data;
  } catch (error: any) {
    toast.warning(error.message || "Failed to fetch tasks");
    return [];
  }
}

export async function editTask({
  title,
  description,
  due_date,
  estimated_cycles,
  status,
  id,
}: {
  title: string;
  description: string;
  due_date: string;
  estimated_cycles: number;
  status: string;
  id: number;
}) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      due_date,
      estimated_cycles,
      status,
    }),
  });

  const data = await response.json();

  if (response.status === 200) {
    toast.success("Task added successfully. 🎉");
  } else
    (error: Error) => {
      toast.warning(error.message);
    };

  return data;
}
