// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "animate.css";
import { QueryProvider } from "../lib/query-client";
import ClientThemeWrapper from "./ClientThemeWrapper"; // Import the new client component

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Export metadata for SEO and page config
export const metadata: Metadata = {
  title: "POMODORO APP",
  description: "SYCN POMODORO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.variable} antialiased`}>
        <ClientThemeWrapper>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ClientThemeWrapper>
      </body>
    </html>
  );
}
