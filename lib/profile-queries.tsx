import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";
import API_BASE_URL from "./api_url";

export interface Profile {
  name: string;
  email: string;
  profile_photo: string;
}

function getToken(): string | null {
  const storeToken = useAuthStore.getState().token;
  return storeToken || Cookies.get("token") || null;
}

export async function fetchProfile(): Promise<Profile> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(
    `${API_BASE_URL}profile-management/get-user-profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.log("API error:", errorText, "Status:", response.status);
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  const data = await response.json();
  console.log("API raw response:", data);

  return {
    name: data.name || "",
    email: data.email || "",
    profile_photo: data.profile_photo || "",
  };
}

export async function editProfile(
  updatedProfile: Partial<Profile>
): Promise<Profile> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  const response = await fetch(
    `${API_BASE_URL}profile-management/get-user-profile`,
    {
      // Verify PATCH endpoint
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProfile),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.log("API error:", errorText, "Status:", response.status);
    throw new Error(`Failed to update profile: ${response.status}`);
  }

  const data = await response.json();
  console.log("API raw response (edit):", data);

  return {
    name: data.name || "",
    email: data.email || "",
    profile_photo: data.profile_photo || "",
  };
}
