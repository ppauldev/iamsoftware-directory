import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SubmissionSuccessPage() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Submission!</h1>
      <p className="text-muted-foreground mb-8">
        Your website has been submitted for review. It will appear on the site once approved.
        You can check the status in the admin panel.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
} 