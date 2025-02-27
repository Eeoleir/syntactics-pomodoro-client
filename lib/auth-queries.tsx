import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";
import API_BASE_URL from "./api_url";

export interface User {
  email: string;
  name?: string;
}

export interface Preference {
  user_id: number;
  focus_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  cycles_before_long_break: number;
  is_auto_start_breaks: number;
  is_auto_start_focus: number;
  is_auto_complete_tasks: number;
  is_auto_switch_tasks: number;
  is_dark_mode: number;
}

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  return storeToken || Cookies.get("token") || null;
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export async function fetchPreferences(): Promise<Preference[]> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(`${API_BASE_URL}preferences`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch preferences");
  }

  const data = await response.json();
  return data.data;
}
