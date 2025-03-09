import API_BASE_URL from "./api_url";

export interface User {
  email: string;
  name?: string;
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

  if (data.status === false) {
    throw new Error(data.error || "Incorrect email or password");
  }

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

export async function forgotPassword({ email }: { email: string }) {
  const response = await fetch(`${API_BASE_URL}password-reset/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send reset code");
  }

  return data;
}

export async function verifyResetCode({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const response = await fetch(`${API_BASE_URL}password-reset/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid or expired verification code");
  }

  return data;
}

export async function resetPassword({
  password,
  password_confirmation,
  token,
}: {
  password: string;
  password_confirmation: string;
  token: string;
}) {
  const response = await fetch(`${API_BASE_URL}password-reset/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password,
      password_confirmation,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password");
  }

  return data;
}

export async function validateToken(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}auth/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    // console.log(response.status);
    const data = await response.json();
    // console.log(`Token check response: ${data}`);

    return response.status;
  } catch (e) {
    // console.log(`err: ${e}`);
  }
}
