import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The IAM Directory - Identity and Access Management Software",
  description: "Find the right Identity and Access Management (IAM) solution for your business. Explore IAM software vendors, features, and services.",
  keywords: ["IAM", "Identity and Access Management", "IAM software", "IAM vendors", "IAM solutions"],
  icons: {
    icon: [
      {
        url: "/iamsoftware-icon-tr.svg",
        type: "image/svg+xml",
      }
    ],
    shortcut: "/iamsoftware-icon-tr.svg",
    apple: "/iamsoftware-icon-tr.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
