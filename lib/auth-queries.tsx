export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch("http://192.167.0.165:8000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw alert(data.error||"Something went wrong");
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
  const response = await fetch("http://192.167.0.165:8000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw alert(data.error||"Something went wrong");
  }

  return data;
}
