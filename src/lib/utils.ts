import * as React from "react";
import { ReactNode } from 'react';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/-+/g, '-');        // Replace multiple - with single -
}

export function highlightText(text: string, query: string): ReactNode {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? React.createElement('span', {
        key: i,
        className: "bg-yellow-100 dark:bg-yellow-900/50"
      }, part)
      : part
  );
}