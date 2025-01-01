import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create multiple demo users
  const demoUsers = await Promise.all(
    Array.from({ length: 10 }, (_, i) => (
      prisma.user.upsert({
        where: { email: `demo${i + 1}@example.com` },
        update: {},
        create: {
          email: `demo${i + 1}@example.com`,
          name: `Demo User ${i + 1}`,
          role: i === 0 ? UserRole.ADMIN : UserRole.USER,
        },
      })
    ))
  );

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
      thumbnail: 'https://ui-avatars.com/api/?name=GitHub&size=600&background=1a1a1a&color=fff',
    },
    {
      url: 'https://figma.com',
      name: 'Figma',
      description: 'Collaborative interface design tool',
      categoryName: 'Design Resources',
      tags: ['Free', 'Cloud'],
      rating: 4,
      review: 'Excellent for team design work. Browser-based is convenient.',
      thumbnail: 'https://ui-avatars.com/api/?name=Figma&size=600&background=a259ff&color=fff',
    },
    {
      url: 'https://notion.so',
      name: 'Notion',
      description: 'All-in-one workspace for notes and collaboration',
      categoryName: 'Productivity',
      tags: ['Free', 'Desktop', 'Mobile'],
      rating: 5,
      review: 'Versatile tool for organizing information and team collaboration.',
      thumbnail: 'https://ui-avatars.com/api/?name=Notion&size=600&background=000000&color=fff',
    },
    {
      url: 'https://chat.openai.com',
      name: 'ChatGPT',
      description: 'AI-powered conversational assistant',
      categoryName: 'AI Tools',
      tags: ['Free', 'Cloud'],
      rating: 5,
      review: 'Revolutionary AI tool for various tasks.',
      thumbnail: 'https://ui-avatars.com/api/?name=ChatGPT&size=600&background=74aa9c&color=fff',
    },
    {
      url: 'https://vercel.com',
      name: 'Vercel',
      description: 'Cloud platform for static sites and Serverless Functions',
      categoryName: 'Development Tools',
      tags: ['Free', 'Cloud', 'API'],
      rating: 5,
      review: 'Best-in-class deployment platform for Next.js applications.',
      thumbnail: 'https://ui-avatars.com/api/?name=Vercel&size=600&background=000000&color=fff',
    },
    {
      url: 'https://sketch.com',
      name: 'Sketch',
      description: 'Digital design platform for Mac',
      categoryName: 'Design Resources',
      tags: ['Paid', 'Desktop'],
      rating: 4,
      review: 'Industry standard for macOS design tools.',
      thumbnail: 'https://ui-avatars.com/api/?name=Sketch&size=600&background=f7b500&color=fff',
    },
    {
      url: 'https://linear.app',
      name: 'Linear',
      description: 'Modern issue tracking and project management',
      categoryName: 'Productivity',
      tags: ['Paid', 'Cloud'],
      rating: 5,
      review: 'Streamlined and fast project management tool.',
      thumbnail: 'https://ui-avatars.com/api/?name=Linear&size=600&background=5E6AD2&color=fff',
    },
    {
      url: 'https://midjourney.com',
      name: 'Midjourney',
      description: 'AI-powered image generation platform',
      categoryName: 'AI Tools',
      tags: ['Paid', 'Cloud'],
      rating: 5,
      review: 'Creates stunning AI-generated artwork with simple text prompts.',
      thumbnail: 'https://ui-avatars.com/api/?name=Midjourney&size=600&background=0a0a0a&color=fff',
    },
    {
      url: 'https://coursera.org',
      name: 'Coursera',
      description: 'Online learning platform with university courses',
      categoryName: 'Learning Platforms',
      tags: ['Free', 'Cloud'],
      rating: 4,
      review: 'High-quality courses from top universities worldwide.',
      thumbnail: 'https://ui-avatars.com/api/?name=Coursera&size=600&background=0056D2&color=fff',
    },
    {
      url: 'https://mongodb.com',
      name: 'MongoDB',
      description: 'Modern document database platform',
      categoryName: 'Development Tools',
      tags: ['Free', 'Cloud', 'Self-hosted'],
      rating: 4,
      review: 'Flexible and scalable database solution.',
      thumbnail: 'https://ui-avatars.com/api/?name=MongoDB&size=600&background=00ED64&color=000',
    },
    {
      url: 'https://framer.com',
      name: 'Framer',
      description: 'Web-based design and prototyping tool',
      categoryName: 'Design Resources',
      tags: ['Free', 'Cloud'],
      rating: 5,
      review: 'Powerful prototyping with code-based customization.',
      thumbnail: 'https://ui-avatars.com/api/?name=Framer&size=600&background=0055FF&color=fff',
    },
    {
      url: 'https://obsidian.md',
      name: 'Obsidian',
      description: 'Knowledge base that works on local Markdown files',
      categoryName: 'Productivity',
      tags: ['Free', 'Desktop', 'Self-hosted'],
      rating: 5,
      review: 'Powerful note-taking with local storage and graph visualization.',
      thumbnail: 'https://ui-avatars.com/api/?name=Obsidian&size=600&background=7E6AD2&color=fff',
    },
    {
      url: 'https://udemy.com',
      name: 'Udemy',
      description: 'Online learning marketplace',
      categoryName: 'Learning Platforms',
      tags: ['Paid', 'Cloud'],
      rating: 4,
      review: 'Wide variety of courses with practical focus.',
      thumbnail: 'https://ui-avatars.com/api/?name=Udemy&size=600&background=A435F0&color=fff',
    },
    {
      url: 'https://replicate.com',
      name: 'Replicate',
      description: 'Platform for running AI models in the cloud',
      categoryName: 'AI Tools',
      tags: ['Paid', 'Cloud', 'API'],
      rating: 4,
      review: 'Makes it easy to run and deploy AI models.',
      thumbnail: 'https://ui-avatars.com/api/?name=Replicate&size=600&background=1A1A1A&color=fff',
    },
  ];

  // Add this function to generate random reviews
  function generateReviews(count: number) {
    return Array.from({ length: count }, () => ({
      content: [
        'Really useful tool for my workflow.',
        'Great features, but could be better.',
        'Exactly what I needed for my project.',
        'Solid tool with good documentation.',
        'Impressive functionality overall.',
        'Has some learning curve but worth it.',
        'Use this daily in my work.',
        'Good value for money.',
      ][Math.floor(Math.random() * 8)],
    }));
  }

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
          ownerId: demoUsers[0].id,
          thumbnail: site.thumbnail,
        },
      });

      // Generate 1-20 reviews per website with different users
      const reviewCount = Math.floor(Math.random() * 20) + 1;
      const reviews = generateReviews(reviewCount);

      // Create multiple reviews per website with different users
      for (const review of reviews) {
        const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
        await prisma.review.create({
          data: {
            content: review.content,
            websiteId: website.id,
            userId: randomUser.id,
            createdAt: new Date(Date.now() - Math.random() * 10000000000),
          },
        });
      }

      // Create 1-50 ratings per website with different users
      const ratingCount = Math.floor(Math.random() * 50) + 1;
      const userIndices = Array.from({ length: demoUsers.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(ratingCount, demoUsers.length));

      for (const userIndex of userIndices) {
        await prisma.rating.upsert({
          where: {
            websiteId_userId: {
              websiteId: website.id,
              userId: demoUsers[userIndex].id,
            }
          },
          update: {
            value: Math.floor(Math.random() * 5) + 1,
          },
          create: {
            value: Math.floor(Math.random() * 5) + 1,
            websiteId: website.id,
            userId: demoUsers[userIndex].id,
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