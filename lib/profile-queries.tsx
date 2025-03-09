import Cookies from "js-cookie";
import useAuthStore from "@/app/stores/authStore";
import API_BASE_URL from "./api_url";
import { toast } from "sonner";

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
    // console.log("API error:", errorText, "Status:", response.status);
    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  const data = await response.json();

  return {
    name: data.name || "",
    email: data.email || "",
    profile_photo: data.profile_photo || "",
  };
}

export async function editProfile(
  updatedProfile: Partial<Profile> & { profile_photo_file?: File }
): Promise<Profile> {
  const token = getToken();
  if (!token) throw new Error("No authentication token available");

  // Create new FormData
  const formData = new FormData();

  // Add each property explicitly
  if (updatedProfile.name) formData.append("name", updatedProfile.name);
  if (updatedProfile.email) formData.append("email", updatedProfile.email);

  // Debug the file
  if (updatedProfile.profile_photo_file) {
    // console.log("File type:", updatedProfile.profile_photo_file.type);
    // console.log("File size:", updatedProfile.profile_photo_file.size);

    // Add the file - be explicit about the third parameter
    formData.append(
      "profile_photo_file",
      updatedProfile.profile_photo_file,
      updatedProfile.profile_photo_file.name
    );
  }

  // Debug the formData
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  const response = await fetch(`${API_BASE_URL}profile-management/patch-user`, {
    method: "POST", // Use POST instead of PATCH for file uploads
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    // console.log("API error:", errorText, "Status:", response.status);
    throw new Error(`Failed to update profile: ${response.status}`);
  }
  toast.success("Profile updated successfully.");
  const data = await response.json();
  // console.log("API raw response (edit):", data);

  const user = data.user || {};
  return {
    name: user.name || "",
    email: user.email || "",
    profile_photo: user.profile_photo || "",
  };
}
