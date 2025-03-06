import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "animate.css";
import { QueryProvider } from "../lib/query-client";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import ClientThemeWrapper from "./ClientThemeWrapper";
import DarkModeToggle, { DarkModeProvider } from "@/components/custom/Toggle";

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

export const metadata: Metadata = {
  title: "POMOSYNC",
  description: "POMODORO APP",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className="invisible">
      <head>
        <style>{`
          html.visible {
            visibility: visible;
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientThemeWrapper>
            <QueryProvider>
              <DarkModeProvider>
                {children}
                <DarkModeToggle />
              </DarkModeProvider>
              <Toaster />
            </QueryProvider>
          </ClientThemeWrapper>
        </NextIntlClientProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.add('visible');
            `,
          }}
        />
      </body>
    </html>
  );
}
