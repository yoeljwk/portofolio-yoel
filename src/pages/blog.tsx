import Layout from "@/components/Layout";
import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Search } from "lucide-react";
import { useState, useMemo } from "react";

const blogPosts = [
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
    title: "TypeScript Best Practices",
    excerpt: "Essential TypeScript patterns and practices for building robust applications.",
    date: "2024-01-01",
    readTime: "7 min read",
    category: "TypeScript",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
  },
  {
    id: 5,
    title: "Building RESTful APIs",
    excerpt: "A comprehensive guide to designing and implementing RESTful APIs.",
    date: "2023-12-28",
    readTime: "8 min read",
    category: "Backend",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
  {
    id: 6,
    title: "Modern CSS Techniques",
    excerpt: "Explore modern CSS features like Grid, Flexbox, and custom properties.",
    date: "2023-12-20",
    readTime: "5 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&q=80",
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(blogPosts.map(post => post.category))];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Head>
        <title>Blog | Yoel Ginting</title>
        <meta
          name="description"
          content="Thoughts, tutorials, and insights about web development"
        />
      </Head>

      <main className="flex w-full flex-col items-center justify-center text-light">
        <Layout className="pt-16">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatedText
              text="Blog & Articles"
              className="mb-4 !text-3xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-4xl"
            />
            <p className="text-light/60 mb-12 text-center">
              Sharing knowledge and experiences in web development
            </p>

            {/* Search and Filter */}
            <div className="mb-10 space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light/50" size={18} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark border border-light/20 rounded-lg text-light placeholder:text-light/50 focus:border-light/40 focus:outline-none transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-light text-dark"
                        : "border border-light/20 text-light hover:border-light/40"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-light/50 text-sm text-center mb-8">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </p>

            <div className="space-y-6 mb-16">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="group p-6 border border-light/10 rounded-lg hover:border-light/30 hover:bg-light/5 transition-all">
                        <div className="flex gap-6 md:flex-col">
                          {/* Image */}
                          <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden md:w-full md:h-48">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-light/50 text-sm mb-2 block">{post.category}</span>
                              <h3 className="text-2xl font-bold text-light mb-2 group-hover:text-light/80 transition-colors md:text-xl">
                                {post.title}
                              </h3>
                              <p className="text-light/60 mb-4">{post.excerpt}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-light/50 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {post.readTime}
                                </span>
                              </div>
                              <div className="text-light/40 group-hover:text-light group-hover:translate-x-1 transition-all">
                                →
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-light/60 mb-4">No articles found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="px-6 py-2 border border-light/20 text-light rounded-lg hover:bg-light hover:text-dark transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
}
