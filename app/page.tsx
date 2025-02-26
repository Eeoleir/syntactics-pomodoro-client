"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const firstTimeUser = JSON.parse(
      localStorage.getItem("firstTimeUser") ?? "true"
    );

    if (firstTimeUser) {
      localStorage.setItem("firstTimeUser", JSON.stringify(false));
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1>LOADING PAGE</h1>
    </div>
  );
}
