import useAuthStore from "@/app/stores/authStore";
import Cookies from "js-cookie";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;

  return Cookies.get("token") ?? null;
}

export async function changeTimerStatusRequest(
  status: string,
  timer_id: number,
  time_remaining: number,
  until_long_break: number
) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}timer/${timer_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: status,
      time_remaining: time_remaining,
      until_long_break: until_long_break
    }),
  });
  if (!response.ok) {
  }
  return await response.json();
}

export async function createTimerRequest(
  task_id: number,
  session_type: string,
  duration: number,
  until_long_break: number
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
      until_long_break: until_long_break
    }),
  });
  if (!response.ok) {
    toast.warning("Failed to play timer");

    throw new Error("Failed to play timer");
  }
  return await response.json();
}

export async function getOngoingTimerRequest() {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}timer`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    toast.warning("Failed to check timer status");
    throw new Error("Failed to check timer status");
  }

  if (response.status === 404) {
    return null;
  }

  return await response.json();
}
