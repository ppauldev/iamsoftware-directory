'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useRouter } from 'next/navigation';

interface WebsiteSubmissionFormProps {
  categories: {
    id: string;
    name: string;
  }[];
  tags: {
    id: string;
    name: string;
  }[];
}

export function WebsiteSubmissionForm({ categories, tags }: WebsiteSubmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const url = formData.get('url') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('category') as string;
    const selectedTags = formData.getAll('tags') as string[];

    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          name,
          description,
          categoryId,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit website');
      }

      router.push('/submissions/success');
    } catch (error) {
      console.error('Error submitting website:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          Website URL
        </label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Website Name
        </label>
        <Input
          id="name"
          name="name"
          required
          placeholder="My Amazing Website"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe what your website does..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tags"
                value={tag.id}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Website'}
      </Button>
    </form>
  );
} 