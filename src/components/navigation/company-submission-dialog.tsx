'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

// Custom X icon component
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  );
}

interface CompanySubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanySubmissionDialog({ open, onOpenChange }: CompanySubmissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Propose a Company</DialogTitle>
          <DialogDescription>
            Choose how you would like to submit a company to the IAM Directory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-6">
          <Button
            disabled
            className="w-full flex items-center gap-2 h-12"
            variant="outline"
          >
            <Mail className="h-5 w-5" />
            Submit via Email
            <span className="text-xs text-muted-foreground ml-2">(Coming Soon)</span>
          </Button>

          <Button
            className="w-full flex items-center gap-2 h-12 cursor-pointer"
            variant="outline"
            onClick={() => window.open('https://www.x.com/phillippaulx', '_blank')}
          >
            <XIcon />
            Submit via x.com
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 