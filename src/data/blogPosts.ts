export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with Next.js 14",
    excerpt: "Learn how to build modern web applications with the latest features of Next.js 14.",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS",
    excerpt: "Tips and tricks to become more productive with Tailwind CSS in your projects.",
    date: "2024-01-10",
    readTime: "4 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
  },
  {
    id: 3,
    title: "React Performance Optimization",
    excerpt: "Best practices for optimizing React applications and improving user experience.",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    id: 4,
    title: "Creative Animations with GSAP",
    excerpt: "Bring your web interfaces to life with scroll-driven animations and custom transitions.",
    date: "2024-01-02",
    readTime: "7 min read",
    category: "Animation",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  },
  {
    id: 5,
    title: "State Management in React 19",
    excerpt: "Understand how React 19 simplifies state with Actions and new Hooks.",
    date: "2023-12-28",
    readTime: "6 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80",
  },
  {
    id: 6,
    title: "TypeScript Best Practices",
    excerpt: "Essential TypeScript patterns and practices for building robust applications.",
    date: "2024-01-01",
    readTime: "7 min read",
    category: "TypeScript",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
  },
  {
    id: 7,
    title: "Building RESTful APIs",
    excerpt: "A comprehensive guide to designing and implementing RESTful APIs.",
    date: "2023-12-28",
    readTime: "8 min read",
    category: "Backend",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
  {
    id: 8,
    title: "Modern CSS Techniques",
    excerpt: "Explore modern CSS features like Grid, Flexbox, and custom properties.",
    date: "2023-12-20",
    readTime: "5 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&q=80",
  },
];
