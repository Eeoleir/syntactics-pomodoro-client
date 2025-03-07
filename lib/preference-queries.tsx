"use client";
import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";
// import { locales } from "@/app/stores/localeStore";
import { Locale } from "@/next-intl-services/config";


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
  language: Locale; 
}

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;
  return Cookies.get("token") ?? null;
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

    return responseData.data;
  } catch (error: any) {
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
      toast.success("Preferences updated successfully.");
      return data;
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error("Invalid JSON response from server");
    }
  } catch (error: any) {
    throw error;
  }
}

export async function editDarkMode(id: number, is_dark_mode: number) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  try {
    const response = await fetch(`${API_BASE_URL}preferences/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_dark_mode: is_dark_mode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update dark mode");
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}

// New function for language preference
export async function editLanguagePreference(id: number, language: string) {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  try {
    const response = await fetch(`${API_BASE_URL}preferences/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        language: language,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update language preference");
    }

    return data;
  } catch (error: any) {
    throw error;
  }
}