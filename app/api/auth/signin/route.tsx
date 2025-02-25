import { NextResponse } from "next/server";

// Define the expected request body shape (optional, for TypeScript)
interface SignInRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password }: SignInRequest = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email === "user@example.com" && password === "password123") {
      const user = {
        email,
        id: "123", 
        name: "Test User", 
      };
      return NextResponse.json(
        { message: "Signed in successfully", user },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}