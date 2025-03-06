import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "animate.css";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import ClientThemeWrapper from "./ClientThemeWrapper";
import { ClientQueryProvider } from "@/lib/query-client";
import { ThemeManager } from "@/components/custom/themeManager";

export const metadata: Metadata = {
  title: "POMOSYNC",
  description: "POMODORO APP",
  icons: {
    icon: "/logo.png",
  },
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isLoggedIn = document.cookie.includes('next-auth.session-token');
                if (!isLoggedIn) {
                  const isDark = localStorage.getItem('theme-loggedOut');
                  if (isDark && JSON.parse(isDark).isDarkMode === true) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ClientThemeWrapper>
            <ClientQueryProvider>
              <ThemeManager>{children}</ThemeManager>
              <Toaster />
            </ClientQueryProvider>
          </ClientThemeWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
