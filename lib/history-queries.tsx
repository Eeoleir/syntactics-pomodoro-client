// @/lib/history-queries.tsx
import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";
import API_BASE_URL from "./api_url";
import { validateToken } from "./auth-queries";

export interface HistoryItem {
  id: number;
  date: string; // Maps to created_at or updated_at
  taskName: string; // Maps to task.title
  focusCycles: number; // Maps to completed_pomodoros
  focusMinutes: number; // Maps to total_focus_time
  breakMinutes: number; // Maps to total_break_time
}

interface ApiHistoryItem {
  id: number;
  completed_pomodoros: number;
  created_at: string;
  status: string;
  task: { title: string };
  task_id: number;
  total_break_time: number;
  total_focus_time: number;
  updated_at: string;
  user_id: number;
}

interface PaginatedHistoryResponse {
  data: ApiHistoryItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  return storeToken || Cookies.get("token") || null;
}

export async function fetchPomodoroHistory(
  page: number
): Promise<HistoryItem[]> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const url = `${API_BASE_URL}pomodoro?page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("API error:", errorText, "Status:", response.status);
    if (response.status === 500) {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No valid token in cookies: 500');
      } else {
        const tokenValidity = await validateToken(token);
        if (tokenValidity === 401) {
          throw new Error(`Token invalid returning user to login: ${tokenValidity}`);
        }
      }
    }
    throw new Error(`Failed to fetch Pomodoro history: ${response.status}`);
  }

  const data: PaginatedHistoryResponse = await response.json();

  return data.data.map((item: ApiHistoryItem) => ({
    id: item.id,
    date: item.updated_at,
    taskName: item.task.title,
    focusCycles: item.completed_pomodoros,
    focusMinutes: item.total_focus_time,
    breakMinutes: item.total_break_time,
  }));
}
