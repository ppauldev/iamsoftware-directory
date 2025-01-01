import { prisma } from '@/lib/prisma';
import AdminWebsitesClient from './client';

export default async function AdminWebsitesPage() {
  const pendingWebsites = await prisma.website.findMany({
    where: { approved: false },
    include: {
      category: true,
      owner: true,
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <AdminWebsitesClient websites={pendingWebsites} />;
} 