import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: UserRole.ADMIN,
    },
  });

  // Create categories
  const categories = [
    { name: 'Development Tools', description: 'Tools for software development' },
    { name: 'Design Resources', description: 'Design tools and assets' },
    { name: 'Productivity', description: 'Apps to boost productivity' },
    { name: 'Learning Platforms', description: 'Educational resources' },
    { name: 'AI Tools', description: 'Artificial Intelligence tools' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name },
    });
  }

  // Create tags
  const tags = [
    'Free', 'Open Source', 'Paid', 'Self-hosted',
    'Cloud', 'API', 'Mobile', 'Desktop'
  ];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });
  }

  // Create demo websites with reviews and ratings
  const websites = [
    {
      url: 'https://github.com',
      name: 'GitHub',
      description: 'Web-based platform for version control and collaboration',
      categoryName: 'Development Tools',
      tags: ['Free', 'Cloud'],
      rating: 5,
      review: 'Essential platform for developers. Great collaboration features.',
    },
    {
      url: 'https://figma.com',
      name: 'Figma',
      description: 'Collaborative interface design tool',
      categoryName: 'Design Resources',
      tags: ['Free', 'Cloud'],
      rating: 4,
      review: 'Excellent for team design work. Browser-based is convenient.',
    },
    {
      url: 'https://notion.so',
      name: 'Notion',
      description: 'All-in-one workspace for notes and collaboration',
      categoryName: 'Productivity',
      tags: ['Free', 'Desktop', 'Mobile'],
      rating: 5,
      review: 'Versatile tool for organizing information and team collaboration.',
    },
    {
      url: 'https://chat.openai.com',
      name: 'ChatGPT',
      description: 'AI-powered conversational assistant',
      categoryName: 'AI Tools',
      tags: ['Free', 'Cloud'],
      rating: 5,
      review: 'Revolutionary AI tool for various tasks.',
    },
  ];

  for (const site of websites) {
    const category = await prisma.category.findUnique({
      where: { name: site.categoryName },
    });

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          in: site.tags,
        },
      },
    });

    if (category) {
      const website = await prisma.website.upsert({
        where: { url: site.url },
        update: {},
        create: {
          url: site.url,
          name: site.name,
          description: site.description,
          categoryId: category.id,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
          approved: true,
          ownerId: demoUser.id,
        },
      });

      // Upsert review
      const existingReview = await prisma.review.findFirst({
        where: { websiteId: website.id, userId: demoUser.id },
      });

      if (existingReview) {
        await prisma.review.update({
          where: { id: existingReview.id },
          data: { content: site.review },
        });
      } else {
        await prisma.review.create({
          data: {
            content: site.review,
            websiteId: website.id,
            userId: demoUser.id,
          },
        });
      }

      // Upsert rating
      const existingRating = await prisma.rating.findFirst({
        where: { websiteId: website.id, userId: demoUser.id },
      });

      if (existingRating) {
        await prisma.rating.update({
          where: { id: existingRating.id },
          data: { value: site.rating },
        });
      } else {
        await prisma.rating.create({
          data: {
            value: site.rating,
            websiteId: website.id,
            userId: demoUser.id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 