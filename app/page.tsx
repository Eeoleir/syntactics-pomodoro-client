"use client";
import { useEffect } from "react";
import LocaleInitializer from "./stores/localeStore";

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
      <LocaleInitializer/>
      <h1>LOADING PAGE</h1>
    </div>
  );
}
