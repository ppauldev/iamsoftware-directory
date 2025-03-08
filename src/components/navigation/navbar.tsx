'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { CompanySubmissionDialog } from '@/components/navigation/company-submission-dialog';
import { FileText } from 'lucide-react';

export function Navbar() {
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const pathname = usePathname();
  const isArticlesPage = pathname?.startsWith('/articles');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-full px-4 sm:px-6 md:px-8">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/iamsoftware-icon-tr.svg"
              alt="The IAM Directory"
              width={32}
              height={32}
              priority
              className="invert-in-dark"
            />
            <span className="sr-only">The IAM Directory</span>
          </Link>
        </div>

        <nav className="flex-1 hidden md:flex justify-center items-center md:space-x-4 lg:space-x-6">
          <Link
            href="/articles"
            className={`text-sm font-medium transition-colors hover:text-primary relative group py-2 px-3 block flex items-center cursor-pointer ${isArticlesPage ? 'text-primary' : ''
              }`}
            title="Articles"
          >
            <FileText className="h-5 w-5" />
            {!isArticlesPage && (
              <span className="ml-2">Articles</span>
            )}
            <span className="absolute inset-0 z-0"></span>
            <span className={`absolute bottom-[-4px] left-0 right-0 h-0.5 bg-primary transition-all duration-200 ${isArticlesPage ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
          </Link>
        </nav>

        <div className="flex-1 flex justify-end items-center gap-6">
          <Button
            onClick={() => setIsSubmissionDialogOpen(true)}
            className="cursor-pointer relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:cursor-pointer active:cursor-pointer"
          >
            <span className="relative z-10">Propose Company</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"></span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <CompanySubmissionDialog
        open={isSubmissionDialogOpen}
        onOpenChange={setIsSubmissionDialogOpen}
      />
    </header>
  );
} 