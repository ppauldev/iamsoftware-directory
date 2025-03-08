import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';

interface MainLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'default' | 'narrow' | 'wide';
}

export function MainLayout({
  children,
  maxWidth = 'default'
}: MainLayoutProps) {
  // Determine container max width based on prop
  const containerClasses = {
    default: 'max-w-7xl',
    narrow: 'max-w-4xl',
    wide: 'max-w-screen-2xl'
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className={`container mx-auto px-4 sm:px-6 ${containerClasses[maxWidth]}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 