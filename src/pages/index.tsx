import AnimatedText from "@/components/AnimatedText";
import TypewriterText from "@/components/TypewriterText";
import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import HeroLottie from "@/components/HeroLottie";
import LiveChat from "@/components/LiveChat";
import Blog from "@/components/Blog";
import { Mail, Download } from "lucide-react";



export default function Home() {
  return (
    <>
      <Head>
        <title>Yoel Ginting</title>
        <meta
          name="description"
          content="Personal portfolio of Yoel Ginting — Web Developer"
        />
      </Head>

      <article
        className={`flex min-h-screen items-center text-light sm:items-start`}
      >
        <Layout className="!pt-24 md:!pt-16 sm:!pt-4">
          <div className="flex w-full items-start justify-between md:flex-col pt-10 pb-28 md:pt-0">
            <div className="w-1/2 md:w-full flex justify-center items-center">
              <HeroLottie />
            </div>
            <div className="flex w-1/2 flex-col items-left self-center lg:w-full lg:text-center md:mt-0">
              <h2 className="font-semibold capitalize mb-4 !text-5xl xl:!text-4xl lg:!text-4xl md:!text-5xl sm:!text-3xl text-light">
                When the{" "}
                <span className="animate-text bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-clip-text text-transparent">
                  code
                </span>{" "}
                works,
              </h2>
              <h2 className="font-semibold capitalize mb-4 !text-5xl xl:!text-4xl lg:!text-4xl md:!text-5xl sm:!text-3xl text-light">
                <span className="animate-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  dreams
                </span>{" "}
                move forward.
              </h2>
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
      <Blog />
      <LiveChat />
    </>
  );
}
