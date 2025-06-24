// This script will create an initial set of data for the blog
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create default settings
  const defaultSettings = [
    { key: 'siteName', value: 'Bajramedia', type: 'string' },
    { key: 'siteDescription', value: 'Creative Digital Agency & Blog Platform', type: 'string' },
    { key: 'siteUrl', value: 'https://bajramedia.com', type: 'string' },
    { key: 'adminEmail', value: 'admin@bajramedia.com', type: 'string' },
    { key: 'postsPerPage', value: '10', type: 'number' },
    { key: 'enableComments', value: 'true', type: 'boolean' },
    { key: 'enableSocialShare', value: 'true', type: 'boolean' },
    { key: 'analyticsCode', value: '', type: 'string' },
    { key: 'footerText', value: '© 2025 Bajramedia. All rights reserved.', type: 'string' },
    { key: 'contactEmail', value: 'contact@bajramedia.com', type: 'string' },
    { key: 'contactPhone', value: '+62 123 456 7890', type: 'string' },
    { key: 'contactAddress', value: 'Bali, Indonesia', type: 'string' },
    { 
      key: 'socialLinks', 
      value: JSON.stringify({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      }), 
      type: 'json' 
    },
    {
      key: 'seoSettings',
      value: JSON.stringify({
        metaTitle: 'Bajramedia - Creative Digital Agency',
        metaDescription: 'Professional digital agency providing creative solutions for your business needs.',
        metaKeywords: 'digital agency, creative, design, development, bali',
        ogImage: ''
      }),
      type: 'json'
    }
  ];

  // Insert settings
  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: setting
    });
  }
  console.log('Created default settings');
  // Create an initial author
  const author = await prisma.author.upsert({
    where: { email: 'admin@bajramedia.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@bajramedia.com',
      avatar: '/images/team.jpg',
      bio: 'Administrator and main content creator for Bajramedia.'
    }
  });
  console.log('Created/found author:', author.name);
  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'web-design' },
      update: {},
      create: {
        name: 'Web Design',
        slug: 'web-design'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-design' },
      update: {},
      create: {
        name: 'Mobile Design',
        slug: 'mobile-design'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology'
      }
    })
  ]);
  console.log('Created/found categories:', categories.map(c => c.name).join(', '));
  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'conversion' },
      update: {},
      create: {
        name: 'Conversion',
        slug: 'conversion'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'ux' },
      update: {},
      create: {
        name: 'UX',
        slug: 'ux'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'mobile' },
      update: {},
      create: {
        name: 'Mobile',
        slug: 'mobile'
      }    }),
    prisma.tag.upsert({
      where: { slug: 'responsive' },
      update: {},
      create: {
        name: 'Responsive',
        slug: 'responsive'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology'
      }    }),
    prisma.tag.upsert({
      where: { slug: 'ai' },
      update: {},
      create: {
        name: 'AI',
        slug: 'ai'
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'development' },
      update: {},
      create: {
        name: 'Development',
        slug: 'development'
      }
    })
  ]);
  console.log('Created/found tags:', tags.map(t => t.name).join(', '));

  // Create sample blog posts
  const posts = [
    {
      title: 'How to Design an Effective Landing Page That Converts',
      slug: 'how-to-design-effective-landing-page',
      excerpt: 'Learn the key principles of designing landing pages that drive conversions and engage users effectively.',
      content: `
# How to Design an Effective Landing Page That Converts

A well-designed landing page can be the difference between a visitor bouncing and a visitor converting. In this article, we'll explore the key principles of designing landing pages that drive conversions and engage users effectively.

## Focus on the Value Proposition

Your value proposition should be the first thing visitors see. It should clearly communicate what you offer and why it matters to your audience. Use a compelling headline that addresses a pain point or offers a solution.

## Keep it Simple

Simplicity is key for landing pages. Remove any unnecessary elements that might distract users from taking the desired action. Focus on a single goal and guide users toward it.

## Use High-Quality Visuals

Images and videos can significantly increase engagement. Use high-quality, relevant visuals that reinforce your message and demonstrate your product or service in action.

## Include Social Proof

Testimonials, reviews, client logos, and case studies build trust and credibility. Incorporate social proof elements to show visitors that others have had positive experiences with your offering.

## Optimize for Mobile

Ensure your landing page performs well on all devices, especially mobile. Test the page on various screen sizes to ensure a seamless experience.

## Create Clear Calls-to-Action

Your CTAs should be prominent, compelling, and action-oriented. Use contrasting colors to make them stand out and place them strategically throughout the page.

## Implement A/B Testing

Continuously test different elements of your landing page to see what resonates best with your audience. This data-driven approach will help you optimize for better conversion rates over time.

By following these principles, you can create landing pages that not only look great but also convert visitors into customers effectively.
      `,
      featuredImage: '/images/team-meeting-alt.jpg',
      published: true,
      readTime: 5,
      authorId: author.id,
      categoryId: categories[0].id, // Web Design
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // Design
          { tag: { connect: { id: tags[1].id } } }, // Conversion
          { tag: { connect: { id: tags[2].id } } }  // UX
        ]
      }
    },
    {
      title: 'The Importance of Mobile-First Design in 2023',
      slug: 'importance-mobile-first-design-2023',
      excerpt: 'With mobile traffic dominating the web, designing for mobile-first is no longer optional but essential.',
      content: `
# The Importance of Mobile-First Design in 2023

In today's digital landscape, mobile devices account for more than half of all web traffic. As a result, designing for mobile-first is no longer optional—it's essential. This article explores why mobile-first design matters and how to implement it effectively.

## What is Mobile-First Design?

Mobile-first design is an approach that prioritizes designing for smaller screens first, then progressively enhancing the design for larger screens. This contrasts with the traditional approach of designing for desktop first and then adapting for mobile devices.

## Why Mobile-First Matters

### Expanding Mobile Usage

Mobile internet usage continues to grow globally. In many developing countries, mobile devices are the primary means of accessing the internet.

### Google's Mobile-First Indexing

Google now predominantly uses the mobile version of content for indexing and ranking. Sites that aren't mobile-friendly may see a negative impact on their search rankings.

### Better User Experience

Mobile-first design forces you to focus on essential content and functionality, leading to cleaner, more focused designs across all devices.

## Best Practices for Mobile-First Design

### Prioritize Content and Features

Identify the most important content and features for your users. Place these elements prominently and consider hiding or deprioritizing less critical elements on smaller screens.

### Optimize Performance

Mobile users often have slower connections and less processing power. Optimize images, minimize code, and eliminate unnecessary scripts to ensure fast loading times.

### Design Touch-Friendly Interfaces

Design with touch in mind. Make interactive elements large enough to tap easily (at least 44x44 pixels), provide adequate spacing between clickable elements, and use familiar patterns for touch gestures.

### Use Responsive Images

Implement responsive images that load appropriate sizes based on the device's screen size and resolution.

### Test on Real Devices

Emulators are useful, but nothing beats testing on actual devices. Test your design on various devices to ensure a consistent experience across different screen sizes and operating systems.

By adopting a mobile-first approach, you'll create websites and applications that meet the needs of today's mobile-centric users while still providing an excellent experience on desktop devices.
      `,
      featuredImage: '/images/team-meeting-2.jpg',
      published: true,
      readTime: 4,
      authorId: author.id,
      categoryId: categories[1].id, // Mobile Design
      tags: {
        create: [
          { tag: { connect: { id: tags[3].id } } }, // Mobile
          { tag: { connect: { id: tags[4].id } } }, // Responsive
          { tag: { connect: { id: tags[0].id } } }  // Design
        ]
      }
    },
    {
      title: 'How AI is Transforming Web Development',
      slug: 'ai-transforming-web-development',
      excerpt: 'Artificial intelligence is revolutionizing how websites are built, optimized, and maintained.',
      content: `
# How AI is Transforming Web Development

Artificial intelligence (AI) is revolutionizing countless industries, and web development is no exception. From automated coding to personalized user experiences, AI is changing how websites are built, optimized, and maintained. This article explores the most significant ways AI is transforming web development.

## AI-Powered Code Generation

AI tools can now generate code based on simple descriptions or requirements. Tools like GitHub Copilot and Tabnine help developers write code faster by suggesting completions based on context and patterns. These tools are particularly helpful for:

- Automating repetitive coding tasks
- Suggesting solutions for common programming challenges
- Helping developers learn new languages and frameworks

## Intelligent Design Systems

AI is revolutionizing the design phase of web development through:

### Automated Design Generation

Tools like Wix ADI and Bookmark's AiDA can generate entire websites based on user inputs and preferences.

### Design Optimization

AI can analyze user interactions to recommend design improvements for better engagement and conversions.

### Accessibility Improvements

AI tools can identify and suggest fixes for accessibility issues, ensuring websites comply with standards like WCAG.

## Enhanced User Experiences

AI enables more personalized and intuitive user experiences through:

### Personalized Content

AI algorithms can analyze user behavior to deliver personalized content, product recommendations, and experiences.

### Chatbots and Virtual Assistants

Natural language processing has made chatbots more sophisticated, providing better customer service and user guidance.

### Predictive User Interfaces

AI can predict user intent and adapt interfaces accordingly, making navigation more intuitive.

## Development Process Optimization

AI is streamlining the development workflow with:

### Intelligent Debugging and Testing

AI systems can identify potential bugs before they occur and automatically generate test cases.

### Performance Optimization

AI tools analyze site performance and suggest optimizations for better loading times and resource usage.

### Security Enhancement

AI systems can identify vulnerabilities and unusual patterns that might indicate security threats.

The integration of AI into web development is still evolving, but its impact is already significant. As these technologies become more sophisticated, we can expect even more dramatic transformations in how websites are created and experienced. Developers who embrace these AI tools will be able to work more efficiently and create better user experiences.
      `,
      featuredImage: '/images/team-meeting.jpg',
      published: true,
      readTime: 6,
      authorId: author.id,
      categoryId: categories[2].id, // Technology
      tags: {
        create: [
          { tag: { connect: { id: tags[5].id } } }, // Technology
          { tag: { connect: { id: tags[6].id } } }, // AI
          { tag: { connect: { id: tags[7].id } } }  // Development
        ]
      }
    }
  ];
  for (const postData of posts) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
      include: { tags: true }
    });
    console.log('Created/found post:', post.title);
  }

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
