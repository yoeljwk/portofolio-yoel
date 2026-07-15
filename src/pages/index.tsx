import AnimatedText from "@/components/AnimatedText";
import TypewriterText from "@/components/TypewriterText";
import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroLottie from "@/components/HeroLottie";
import LiveChat from "@/components/LiveChat";
import LatestPosts from "@/components/LatestPosts";
import { Mail, Download } from "lucide-react";
import FloatingBackground from "@/components/FloatingBackground";




interface TextPart {
  text: string;
  isGradient?: boolean;
  colorClass?: string;
}

const headlineLines = [
  [
    { text: "When the ", isGradient: false },
    { text: "code", isGradient: true, colorClass: "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700" },
    { text: " works,", isGradient: false }
  ],
  [
    { text: "dreams", isGradient: true, colorClass: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" },
    { text: " move forward.", isGradient: false }
  ]
];

const SplitHeadline = ({ isAppLoading = false }: { isAppLoading?: boolean }) => {
  let globalCharIdx = 0;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
      }
    }
  };

  const charVariants = {
    hidden: { x: 150, opacity: 0 },
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.03,
      }
    })
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isAppLoading ? "hidden" : "visible"}
      className="relative inline-block text-left w-full"
    >
      {headlineLines.map((line, lineIdx) => (
        <h2
          key={lineIdx}
          className="font-semibold mb-4 !text-5xl xl:!text-4xl lg:!text-4xl md:!text-5xl sm:!text-3xl text-light flex flex-wrap items-center lg:justify-center gap-y-1"
        >
          {line.map((part, partIdx) => {
            const words = part.text.split(/(\s+)/);
            return words.map((word, wordIdx) => {
              if (/^\s+$/.test(word)) {
                return (
                  <span key={`space-${lineIdx}-${partIdx}-${wordIdx}`} className="inline-block w-[0.27em]">
                    &nbsp;
                  </span>
                );
              }
              if (word === "") return null;

              return (
                <span
                  key={`word-${lineIdx}-${partIdx}-${wordIdx}`}
                  className="inline-block whitespace-nowrap"
                >
                  {word.split("").map((char, charIdx) => {
                    const currentIndex = globalCharIdx++;
                    return (
                      <motion.span
                        key={`char-${lineIdx}-${partIdx}-${wordIdx}-${charIdx}`}
                        variants={charVariants}
                        custom={currentIndex}
                        className={
                          part.isGradient
                            ? `inline-block bg-clip-text text-transparent ${part.colorClass}`
                            : "inline-block text-light"
                        }
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </span>
              );
            });
          })}
        </h2>
      ))}
    </motion.div>
  );
};

export default function Home({ isAppLoading = false }: { isAppLoading?: boolean }) {
  return (
    <>
      <Head>
        <title>Yoel Ginting</title>
        <meta
          name="description"
          content="Personal portfolio of Yoel Ginting — Web Developer"
        />
      </Head>

      <FloatingBackground />

      <article
        className={`flex min-h-screen items-center text-light sm:items-start relative z-10`}
      >
        <Layout className="!bg-transparent !pt-24 md:!pt-16 sm:!pt-4">
          <div className="flex w-full items-start justify-between md:flex-col pt-24 pb-28 md:pt-0">
            <div className="w-1/2 md:w-full flex justify-center items-center">
              <HeroLottie />
            </div>
            <div className="flex w-1/2 flex-col items-left self-center lg:w-full lg:text-center md:mt-4">
              <div className="relative inline-block">
                <SplitHeadline isAppLoading={isAppLoading} />

                <div className="absolute block md:hidden -bottom-24 left-[58%] w-72 h-44 pointer-events-none select-none">
                  <Image
                    src="/images/arrow_yoel2026.svg"
                    alt="Arrow pointing up"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center self-start gap-3 grid-cols-2 lg:self-center">
                <a
                  href="/CV_Yoel_Ginting.pdf"
                  download
                  className="flex items-center gap-2 rounded-lg border-2 border-solid p-2.5 px-6 text-lg font-semibold capitalize text-light hover:bg-transparent hover:border-zinc-400 md:p-2 md:px-4 md:text-base"
                >
                  MY CV
                  <Download size={20} />
                </a>
                <a
                  href="mailto:yoeljwk7@gmail.com"
                  className="flex items-center gap-2 rounded-lg border-2 border-solid bg-gray-600 p-2.5 px-6 text-lg font-semibold capitalize hover:bg-gray-800 text-light md:p-2 md:px-4 md:text-base"
                >
                  EMAIL ME
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </Layout>
      </article>
      <LatestPosts />
      <LiveChat />
    </>
  );
}
