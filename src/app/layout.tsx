import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__NEXT_HYDRATION_ERROR_LOGGER = () => { };
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="text-xl font-bold">
                  AI Directory
                </Link>
              </div>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
} 