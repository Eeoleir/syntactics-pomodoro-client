import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";

export interface Preference {
  user_id: number;
  focus_duration: number;
  short_break_duration: number;
  long_break_duration: number;
  cycles_before_long_break: number;
  is_auto_start_breaks: boolean;
  is_auto_start_focus: boolean;
  is_auto_complete_tasks: boolean;
  is_auto_switch_tasks: boolean;
  is_dark_mode: boolean;
}

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;
  return Cookies.get("token") || null;
}

export async function getPreferences(): Promise<Preference[]> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  try {
    const response = await fetch(`${API_BASE_URL}preferences`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const responseData = await response.json();
    toast.success("Preferences fetched successfully.");
    return responseData.data;
  } catch (error: any) {
    toast.warning(error.message || "Failed to fetch preferences");
    return [];
  }
}

export async function editPreference(
  user_id: number,
  preference: Partial<Omit<Preference, "user_id">>
) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const url = `${API_BASE_URL}preferences/${user_id}`;
  console.log("PATCH URL:", url);

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preference),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("PATCH response error:", response.status, responseText);
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${responseText}`
      );
    }

    try {
      const data = JSON.parse(responseText);
      toast.success("Preference updated successfully. 🎉");
      return data;
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error("Invalid JSON response from server");
    }
  } catch (error: any) {
    toast.warning(error.message);
    throw error;
  }
}
