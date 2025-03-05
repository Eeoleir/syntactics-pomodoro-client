"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ClientThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useServerInsertedHTML(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `/ Your server-inserted styles here /`,
        }}
      />
    );
  });

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
