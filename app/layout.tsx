import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "animate.css";
import { QueryProvider } from "../lib/query-client";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// const foco = Foco({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-foco",
// });

export const metadata: Metadata = {
  title: "POMODORO APP",
  description: "SYCN POMODORO",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${rajdhani.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
