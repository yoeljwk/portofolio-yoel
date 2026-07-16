import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Heart, Share2 } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState } from "react";

interface BlogPostDetails {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

// Simple inline parser for **bold** and `code`
const parseInlineMarkup = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-yellow-300">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

// Custom light-weight markdown parser for rendering body content
const renderMarkdown = (content: string) => {
  if (!content) return null;

  // Split by code blocks first to isolate them
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    // If it's a code block
    if (part.startsWith("```") && part.endsWith("```")) {
      const codeLines = part.slice(3, -3).trim().split("\n");
      const language = codeLines[0].match(/^[a-zA-Z0-9_-]+$/) ? codeLines[0] : "";
      const code = language ? codeLines.slice(1).join("\n") : codeLines.join("\n");

      return (
        <div key={index} className="my-6 border border-white/10 rounded-xl overflow-hidden bg-black/40 font-mono">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/3 text-[10px] text-light/40 uppercase tracking-widest font-['Share_Tech_Mono']">
            <span>{language || "code"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          </div>
          <pre className="p-4 text-xs overflow-x-auto text-[#d4d4d4] leading-relaxed font-mono">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // Split by standard paragraphs/headers
    const lines = part.split("\n");
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={`${index}-${lineIdx}`} className="h-4" />;

      // Headings
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={`${index}-${lineIdx}`} className="text-2xl font-bold tracking-tight text-white mt-10 mb-4 pb-2 border-b border-white/5">
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={`${index}-${lineIdx}`} className="text-xl font-bold tracking-tight text-yellow-400 mt-8 mb-3">
            {trimmed.slice(3)}
          </h3>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={`${index}-${lineIdx}`} className="text-lg font-semibold text-white mt-6 mb-2">
            {trimmed.slice(4)}
          </h4>
        );
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={`${index}-${lineIdx}`} className="border-l-2 border-yellow-400 pl-4 py-1 my-6 italic text-light/70 text-[15px] leading-relaxed">
            {trimmed.slice(2)}
          </blockquote>
        );
      }

      // Numbered List (e.g. 1. Item)
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        const num = numMatch[1];
        const rest = numMatch[2];
        return (
          <li key={`${index}-${lineIdx}`} className="flex items-start gap-2.5 text-light/80 text-[15px] sm:text-sm mb-3 pl-1 leading-relaxed">
            <span className="text-yellow-400 font-mono text-[13px] select-none w-4 text-right">{num}.</span>
            <span className="flex-1">{parseInlineMarkup(rest)}</span>
          </li>
        );
      }

      // Bulleted List (e.g. - Item)
      if (trimmed.startsWith("- ")) {
        return (
          <li key={`${index}-${lineIdx}`} className="flex items-start gap-3 text-light/80 text-[15px] sm:text-sm mb-3 pl-1 leading-relaxed">
            <span className="text-yellow-400 select-none mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="flex-1">{parseInlineMarkup(trimmed.slice(2))}</span>
          </li>
        );
      }

      // Paragraph
      return (
        <p key={`${index}-${lineIdx}`} className="text-light/80 text-[15px] sm:text-sm leading-relaxed mb-6">
          {parseInlineMarkup(line)}
        </p>
      );
    });
  });
};

export default function BlogPostPage({ post }: { post: BlogPostDetails | null }) {
  const [liked, setLiked] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-light font-['Share_Tech_Mono'] uppercase tracking-wider">
        Article Node Not Found
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <>
      <Head>
        <title>{post.title} | Yoel Ginting</title>
        <meta name="description" content={post.excerpt} />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Reading Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-yellow-400 origin-left z-50 opacity-80" 
        style={{ scaleX }}
      />

      <main className="w-full text-light bg-[#080809] grain-bg min-h-screen overflow-x-hidden font-['Inter',_sans-serif]">
        <Layout className="pt-28 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            
            {/* Back to Blog */}
            <div className="mb-8">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 text-xs font-['Share_Tech_Mono'] uppercase tracking-wider text-light/40 hover:text-light transition-colors"
              >
                <ArrowLeft size={12} /> Back to Articles
              </Link>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="relative w-full h-[240px] sm:h-[160px] rounded-xl overflow-hidden border border-white/10 bg-black/40 mb-8">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8">
              <span className="text-xs font-['Share_Tech_Mono'] uppercase tracking-widest text-yellow-400 block mb-2">
                {post.category}
              </span>
              
              <h1 className="text-3xl sm:text-2xl font-bold tracking-tight text-white mb-4 leading-snug">
                {post.title}
              </h1>

              {/* Meta information */}
              <div className="flex items-center justify-between text-light/40 text-xs font-['Share_Tech_Mono'] uppercase tracking-wider border-y border-white/10 py-3 mt-4">
                <div className="flex items-center gap-4">
                  <span>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span>
                    {post.readTime}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLiked(!liked)} 
                    className={`hover:text-red-400 transition-colors flex items-center justify-center ${liked ? "text-red-500" : "text-light/40"}`}
                    title="Like Post"
                  >
                    <Heart size={14} fill={liked ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="hover:text-light transition-colors flex items-center justify-center text-light/40"
                    title="Share Post"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <article className="text-light/95 leading-relaxed">
              {renderMarkdown(post.content)}
            </article>

          </div>
        </Layout>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const { db } = await import("@/lib/firebase");
    const { collection, getDocs } = await import("firebase/firestore");

    const blogsCollection = collection(db, "blogs");
    const snapshot = await getDocs(blogsCollection);

    const paths = snapshot.docs
      .filter(doc => doc.data().status === "published")
      .map(doc => ({
        params: { id: doc.id }
      }));

    return {
      paths,
      fallback: "blocking"
    };
  } catch (error) {
    console.error("Failed to generate blog paths:", error);
    return {
      paths: [],
      fallback: "blocking"
    };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    const { db } = await import("@/lib/firebase");
    const { doc, getDoc } = await import("firebase/firestore");

    const docRef = doc(db, "blogs", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().status !== "published") {
      return {
        notFound: true
      };
    }

    const data = docSnap.data();
    const post = {
      id: docSnap.id,
      title: data.title || "",
      excerpt: data.excerpt || "",
      content: data.content || "",
      date: data.published_at || data.createdAt || "",
      readTime: data.read_time || "",
      category: data.category || "",
      image: data.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    };

    return {
      props: {
        post
      },
      revalidate: 60
    };
  } catch (error) {
    console.error("Failed to fetch blog post by ID:", error);
    return {
      notFound: true
    };
  }
}
