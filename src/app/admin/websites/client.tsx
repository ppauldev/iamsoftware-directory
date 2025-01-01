'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  category: { name: string };
  owner: { name: string | null };
  tags: Array<{ id: string; name: string }>;
}

async function approveWebsite(id: string) {
  const res = await fetch(`/api/websites/${id}/approve`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to approve website');
}

async function rejectWebsite(id: string) {
  const res = await fetch(`/api/websites/${id}/reject`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reject website');
}

export default function AdminWebsitesClient({ websites: initialWebsites }: { websites: Website[] }) {
  const [websites, setWebsites] = useState(initialWebsites);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  async function handleAction(website: Website, action: 'approve' | 'reject') {
    try {
      if (action === 'approve') {
        await approveWebsite(website.id);
        toast({
          title: "Website Approved",
          description: `${website.name} has been approved and is now live.`,
        });
      } else {
        await rejectWebsite(website.id);
        toast({
          title: "Website Rejected",
          description: `${website.name} has been rejected and removed.`,
          variant: "destructive",
        });
      }
      setWebsites(websites.filter(w => w.id !== website.id));
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process the website. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Websites</h1>
      <div className="space-y-4">
        {websites.map(website => (
          <div key={website.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">{website.name}</h2>
                <p className="text-sm text-muted-foreground">
                  <a href={website.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {website.url}
                  </a>
                </p>
                <p className="mt-2">{website.description}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Category:</span> {website.category.name}
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-medium">Submitted by:</span>{' '}
                  {website.owner.name || 'Anonymous'}
                </div>
                <div className="mt-1 flex gap-2">
                  {website.tags.map(tag => (
                    <span key={tag.id} className="text-xs bg-secondary px-2 py-1 rounded">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedWebsite(website);
                        setAction('reject');
                      }}
                    >
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Website</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to reject "{website.name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedWebsite(null);
                          setAction(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleAction(website, 'reject')}
                      >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setSelectedWebsite(website);
                        setAction('approve');
                      }}
                    >
                      Approve
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Approve Website</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to approve "{website.name}"? This will make it visible on the site.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedWebsite(null);
                          setAction(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleAction(website, 'approve')}
                      >
                        Approve
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
        {websites.length === 0 && (
          <p className="text-muted-foreground">No pending websites</p>
        )}
      </div>
    </div>
  );
} 