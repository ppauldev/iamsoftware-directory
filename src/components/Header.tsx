'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Website Directory
          </Link>

          <nav className="flex items-center space-x-4">
            <Link href="/categories" className="hover:text-gray-600">
              Categories
            </Link>
            <Link href="/submit" className="hover:text-gray-600">
              Submit Website
            </Link>
            {status === 'loading' ? (
              <Button variant="ghost" disabled>
                Loading...
              </Button>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="hover:text-gray-600">
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => signIn()}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 