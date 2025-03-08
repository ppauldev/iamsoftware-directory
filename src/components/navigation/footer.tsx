import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 md:py-8 max-w-full px-4 sm:px-6 md:px-8">
        <div className="flex-1 text-center md:text-left">
          {/* Left side - empty for now */}
        </div>

        <div className="flex-1 text-center py-4 md:py-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} The IAM Directory. All rights reserved.
          </p>
        </div>

        <div className="flex-1 text-center md:text-right">
          <p className="text-sm text-muted-foreground">
            Made by <Link href="https://x.com/phillippaulx" target="_blank" className="underline underline-offset-4 hover:text-primary">Acrima</Link>
          </p>
        </div>
      </div>
    </footer>
  );
} 