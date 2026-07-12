import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";

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
];

export default function Blog() {
  return (
    <section className="w-full py-24 bg-black">
      <div className="max-w-6xl mx-auto px-8 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-light mb-2 md:text-3xl">Latest Posts</h2>
          <p className="text-light/60">Thoughts and tutorials about web development</p>
        </motion.div>

        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/blog"
            className="inline-block px-6 py-2 border border-light/20 text-light rounded-lg hover:bg-light hover:text-dark transition-all"
          >
            View All Posts
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
