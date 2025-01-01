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
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { WebsiteForm } from '@/components/admin/WebsiteForm';

interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  thumbnail: string | null;
  approved: boolean;
  category: { id: string; name: string };
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

async function createWebsite(data: any) {
  const res = await fetch('/api/websites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create website');
  return res.json();
}

export default function AdminWebsitesClient({ websites: initialWebsites }: { websites: Website[] }) {
  const [websites, setWebsites] = useState(initialWebsites);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setWebsites(initialWebsites);
  }, [initialWebsites]);

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

  async function handleDelete(website: Website) {
    try {
      const res = await fetch(`/api/websites/${website.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete website');

      setWebsites(websites.filter(w => w.id !== website.id));
      toast({
        title: "Website Deleted",
        description: `${website.name} has been deleted.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete website.",
        variant: "destructive",
      });
    }
  }

  async function handleUpdate(website: Website, data: any) {
    try {
      const res = await fetch(`/api/websites/${website.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update website');

      const updatedWebsite = await res.json();
      setWebsites(websites.map(w => w.id === website.id ? updatedWebsite : w));
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      throw error;
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Websites</h1>
        <Button onClick={() => setIsCreating(true)}>Add Website</Button>
      </div>

      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
            </DialogHeader>
            <WebsiteForm
              onSubmit={async (data) => {
                try {
                  const newWebsite = await createWebsite(data);
                  setWebsites(prevWebsites => [newWebsite, ...prevWebsites]);
                  setIsCreating(false);
                  toast({
                    title: "Success",
                    description: `${newWebsite.name} has been created successfully.`,
                  });
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to create website.",
                    variant: "destructive",
                  });
                  throw error;
                }
              }}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-4">
        {websites.map((website) => (
          <div key={website.id} className="flex items-center justify-between p-4 border rounded">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{website.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${website.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {website.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{website.url}</p>
            </div>
            <div className="flex gap-2">
              {!website.approved && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleAction(website, 'approve')}
                >
                  Approve
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedWebsite(website);
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setSelectedWebsite(website)}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Website</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete "{website.name}"? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedWebsite(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(website)}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      {isEditing && selectedWebsite && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Website</DialogTitle>
            </DialogHeader>
            <WebsiteForm
              website={selectedWebsite}
              onSubmit={(data) => handleUpdate(selectedWebsite, data)}
              onCancel={() => {
                setIsEditing(false);
                setSelectedWebsite(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 