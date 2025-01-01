'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { createSlug } from "@/lib/utils";

interface Website {
  id: string;
  name: string;
  url: string;
  description: string;
  thumbnail: string | null;
  approved: boolean;
  category: { id: string; name: string };
  tags: Array<{ id: string; name: string }>;
  tier: number;
  slug: string;
}

interface WebsiteFormProps {
  website?: Website;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface WebsiteFormData {
  name: string;
  url: string;
  description: string;
  extendedDescription?: string | null;
  categoryId: string;
  thumbnail?: string;
  approved: boolean;
  tier: number;
  tags: string[];
  slug: string;
}

export function WebsiteForm({ website, onSubmit, onCancel }: WebsiteFormProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [tags, setTags] = useState<string[]>(website?.tags.map(t => t.name) || []);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: website?.name || '',
    url: website?.url || '',
    description: website?.description || '',
    categoryId: website?.category?.id || '',
    thumbnail: website?.thumbnail || '',
    approved: website?.approved || false,
    tier: website?.tier || 1,
    tags: website?.tags.map(t => t.name) || [],
    slug: website?.slug || '',
  });

  useEffect(() => {
    // Fetch categories when component mounts
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setFormData({ ...formData, tags: [...tags, newTag] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setFormData({ ...formData, tags: tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        slug: createSlug(formData.name),
      };
      await onSubmit(dataToSubmit);
      toast({
        title: "Success",
        description: `Website ${website ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${website ? 'update' : 'create'} website.`,
        variant: "destructive",
      });
    }
  };

  const { register } = useForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="url">URL</label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="thumbnail">Thumbnail URL</label>
        <Input
          id="thumbnail"
          type="url"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: true })}
          placeholder="Brief description for the website card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="extendedDescription">Extended Description</Label>
        <Textarea
          id="extendedDescription"
          {...register('extendedDescription')}
          placeholder="Detailed description for the website detail page (Tier 2 only)"
          rows={6}
        />
        <p className="text-sm text-muted-foreground">
          This description will only be shown on the detail page for Tier 2 websites.
        </p>
      </div>

      <div>
        <label>Tags</label>
        <div className="flex gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
          />
          <Button type="button" onClick={handleAddTag}>
            Add
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="approved"
            checked={formData.approved}
            onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
          />
          <label htmlFor="approved">Approved</label>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="tier">Tier</label>
          <Select
            value={formData.tier.toString()}
            onValueChange={(value) => setFormData({ ...formData, tier: parseInt(value) })}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tier 1</SelectItem>
              <SelectItem value="2">Tier 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {website ? 'Update' : 'Create'} Website
        </Button>
      </div>
    </form>
  );
} 