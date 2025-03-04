import useAuthStore from "@/app/stores/authStore";
import Cookies from "js-cookie";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;

  return Cookies.get("token") || null;
}

export async function pauseTimerRequest(status: string, timer_id: number) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}timer/${timer_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: "paused",
    }),
  });
  if (!response.ok) {
    toast.warning("Failed to pause timer");

    throw new Error("Failed to pause timer");
  }
  toast.success("Timer paused successfully");
  return await response.json();
}

export async function playTimerRequest(
  task_id: number,
  session_type: string,
  duration: number
) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}timer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      task_id: task_id,
      session_type: session_type,
      duration: duration,
    }),
  });
  if (!response.ok) {
    toast.warning("Failed to play timer");

    throw new Error("Failed to play timer");
  }
  toast.success("Timer play successfully");
  return await response.json();
}
