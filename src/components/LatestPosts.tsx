import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import gsap from "gsap";

import { blogPosts } from "@/data/blogPosts";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

export default function LatestPosts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLUListElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const snap = await getDocs(collection(db, "blogs"));
        if (snap.empty) {
          setPosts(blogPosts.map(p => ({ ...p, id: String(p.id) })));
        } else {
          const fetched = snap.docs
            .map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || "",
                excerpt: data.excerpt || "",
                date: data.published_at || data.createdAt || "",
                readTime: data.read_time || "",
                category: data.category || "",
                image: data.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
                status: data.status || "draft",
                publishedAt: data.published_at || ""
              };
            })
            .filter(post => post.status === "published")
            .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
            .slice(0, 8)
            .map(({ status, publishedAt, ...rest }) => rest);

          setPosts(fetched);
        }
      } catch (err) {
        console.error("Failed to load latest posts from firestore:", err);
        setPosts(blogPosts.map(p => ({ ...p, id: String(p.id) })));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  // Duplicate items to prevent animation overlaps
  const duplicatedPosts = Array.from({ length: 3 }).flatMap((_, copyIdx) =>
    posts.map((post) => ({ ...post, uniqueId: `${post.id}-${copyIdx}` }))
  );

  useEffect(() => {
    if (loading || posts.length === 0) return;

    // Dynamic import to prevent SSR errors
    const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
    const { Draggable } = require("gsap/dist/Draggable");
    gsap.registerPlugin(ScrollTrigger, Draggable);

    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer) return;


    // Get all list items (cards)
    const cards = gsap.utils.toArray<HTMLElement>(cardsContainer.children);
    if (cards.length === 0) return;

    let triggerRef: { current: any } = { current: null };

    let ctx = gsap.context(() => {
      // Initial State of items
      gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

      const spacing = 0.1; // spacing of the cards (stagger)
      const snapTime = gsap.utils.snap(spacing); // snap playhead on the seamlessLoop

      // Animate function for each card
      const animateFunc = (element: HTMLElement) => {
        const tl = gsap.timeline();
        tl.fromTo(
          element,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            zIndex: 100,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            immediateRender: false,
          }
        ).fromTo(
          element,
          { xPercent: 400 },
          { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
          0
        );
        return tl;
      };

      const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
      const playhead = { offset: 0 };
      const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

      const scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() {
          seamlessLoop.time(wrapTime(playhead.offset));
        },
        duration: 0.5,
        ease: "power3.out",
        paused: true,
      });


      // Helper to map timeline offset to window scroll position
      const offsetToScroll = (offset: number) => {
        if (!triggerRef.current) return 0;
        const wrappedOffset = wrapTime(offset);
        const progress = wrappedOffset / seamlessLoop.duration();
        return triggerRef.current.start + progress * (triggerRef.current.end - triggerRef.current.start);
      };

      const scrollToOffset = (targetOffset: number) => {
        const targetScroll = offsetToScroll(targetOffset);
        if (triggerRef.current) {
          triggerRef.current.scroll(targetScroll);
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        pin: true,
        pinSpacing: true,
        onUpdate(self: any) {
          // Sync the scrub offset with the scroll progress
          scrub.vars.offset = self.progress * seamlessLoop.duration();
          scrub.invalidate().restart();
        },
      });

      triggerRef.current = trigger;



      // Draggable creation
      const dragProxy = dragProxyRef.current;
      let draggableInstance: any = null;
      if (dragProxy) {
        draggableInstance = Draggable.create(dragProxy, {
          type: "x",
          trigger: cardsContainer,
          onPress() {
            this.startOffset = scrub.vars.offset;
          },
          onDrag() {
            // Update the scroll progress directly during dragging
            const dragOffset = this.startOffset + (this.startX - this.x) * 0.0015;
            const targetScroll = offsetToScroll(dragOffset);
            if (triggerRef.current) {
              triggerRef.current.scroll(targetScroll);
            }
          },
          onDragEnd() {
            const snappedOffset = snapTime(scrub.vars.offset);
            scrollToOffset(snappedOffset);
          },
        })[0];
      }

      return () => {
        if (draggableInstance) draggableInstance.kill();
      };
    }, containerRef);

    return () => {
      // Kill only the ScrollTrigger instance of this component BEFORE ctx.revert()
      // to avoid breaking ScrollTriggers/Lenis globally in other components.
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
      ctx.revert();
    };

    function buildSeamlessLoop(
      items: HTMLElement[],
      spacing: number,
      animateFunc: (el: HTMLElement) => gsap.core.Timeline
    ) {
      let overlap = Math.ceil(1 / spacing),
        startTime = items.length * spacing + 0.5,
        loopTime = (items.length + overlap) * spacing + 1,
        rawSequence = gsap.timeline({ paused: true }),
        seamlessLoop = gsap.timeline({
          paused: true,
          repeat: -1,
          onRepeat() {
            this._time === this._dur && (this._tTime += this._dur - 0.01);
          },
        }),
        l = items.length + overlap * 2,
        time,
        i,
        index;

      for (i = 0; i < l; i++) {
        index = i % items.length;
        time = i * spacing;
        rawSequence.add(animateFunc(items[index]), time);
        i <= items.length && seamlessLoop.add("label" + i, time);
      }

      rawSequence.time(startTime);

      seamlessLoop
        .to(rawSequence, {
          time: loopTime,
          duration: loopTime - startTime,
          ease: "none",
        })
        .fromTo(
          rawSequence,
          { time: overlap * spacing + 1 },
          {
            time: startTime,
            duration: startTime - (overlap * spacing + 1),
            immediateRender: false,
            ease: "none",
          }
        );

      return seamlessLoop;
    }
  }, [loading, posts]);

  return (
    <section ref={containerRef} className="gallery-container w-full relative z-10">
      <div className="w-full max-w-6xl mx-auto px-8 md:px-4 absolute top-12 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-light mb-2 md:text-3xl">Latest Posts</h2>
          <p className="text-light/60">About web development</p>
        </motion.div>
      </div>

      <ul className="gallery-cards" ref={cardsContainerRef}>
        {duplicatedPosts.map((post) => (
          <li key={post.uniqueId} className="gallery-card-item">
            <Link href={`/blog/${post.id}`} className="absolute inset-0 z-10" />

            {/* Inset Image Frame */}
            <div className="gallery-card-image-frame">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 13.5rem, 17rem"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="gallery-card-content pointer-events-none">
              <div>
                <span className="gallery-card-category">{post.category}</span>
                <h3 className="gallery-card-title font-mori">{post.title}</h3>
                <p className="gallery-card-excerpt">{post.excerpt}</p>
              </div>

              <div className="gallery-card-meta">
                <div className="gallery-card-meta-info">
                  <span className="gallery-card-meta-item">
                    <Calendar size={9} />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="gallery-card-meta-item">
                    <Clock size={9} />
                    {post.readTime}
                  </span>
                </div>
                <span className="gallery-card-arrow">→</span>
              </div>
            </div>
          </li>
        ))}

      </ul>

      <div className="gallery-actions">
        <Link
          href="/blog"
          className="gallery-btn flex items-center gap-1"
        >
          View All Posts
        </Link>
      </div>

      <div ref={dragProxyRef} className="gallery-drag-proxy" />
    </section>
  );
}
