import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import { useRef } from "react";
import SplitTextMori from "@/components/SplitTextMori";

import proj1 from "../../public/images/projects/jaringan-doa.png";
import proj2 from "../../public/images/projects/clone-rinso.png";
import proj3 from "../../public/images/projects/dicepatin.png";
import proj4 from "../../public/images/projects/wwgi.png";
import proj5 from "../../public/images/projects/MaritimX.png";
import proj6 from "../../public/images/projects/turbines.png";

import { motion } from "framer-motion";

interface ArticleProps {
  title: string;
  img?: any;
  date?: string;
  link?: string;
}

const Article = ({ title }: ArticleProps) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1, transition: { duration: 0.4 } }}
      viewport={{ once: true }}
      className="w-full p-6 rounded-lg bg-dark/50 border border-light/10 backdrop-blur-sm"
    >
      <p className="text-sm font-['Share_Tech_Mono'] text-light/50 tracking-wider text-center uppercase">{title}</p>
    </motion.div>
  );
};

interface FeaturedProjectProps {
  num: string;
  type: string;
  title: string;
  summary: string;
  img: any;
  link: string;
  tools: string;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .trim();
};

const scanVariants = {
  initial: { top: "0%", opacity: 0 },
  visible: { opacity: 0 },
  hover: {
    top: ["0%", "100%"],
    opacity: [0, 1, 1, 0],
    transition: {
      top: {
        duration: 7.0,
        repeat: Infinity,
        ease: "linear"
      },
      opacity: {
        duration: 7.0,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.1, 0.9, 1]
      }
    }
  }
};

const rowVariants = {
  initial: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturedProject = ({
  num,
  type,
  title,
  summary,
  img,
  link,
  tools
}: FeaturedProjectProps) => {
  return (
    <div className="project-row transition-opacity duration-500 w-full">
    <motion.div
      variants={rowVariants}
      initial="initial"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="w-full flex md:flex-col items-center md:items-start justify-between py-12 md:py-8 border-b border-light/10 gap-14 md:gap-6 group"
    >
      <div className="flex-1 flex gap-8 sm:gap-4 items-start w-full">
        <span className="font-['Bebas_Neue'] text-4xl sm:text-3xl text-light/20 select-none pt-1 leading-none tracking-wider">
          {num}
        </span>
        
        <div className="space-y-4 flex-1">
          <h2 className="font-['Bebas_Neue'] text-5xl sm:text-3xl xs:text-2xl text-light leading-none tracking-wide transition-colors duration-200 uppercase">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            ) : (
              title
            )}
          </h2>

          <div className="flex flex-wrap gap-2">
            {type && (
              <span className="font-['Share_Tech_Mono'] text-[10px] sm:text-[9px] px-3 py-1 rounded border border-light/25 bg-transparent uppercase text-light/85 tracking-wider">
                {type}
              </span>
            )}
            {tools && (
              <span className="font-['Share_Tech_Mono'] text-[10px] sm:text-[9px] px-3 py-1 rounded border border-light/25 bg-transparent uppercase text-light/85 tracking-wider">
                {tools}
              </span>
            )}
          </div>

          {summary && (
            <p className="font-['Share_Tech_Mono'] text-xs sm:text-[11px] text-light/50 max-w-xl leading-relaxed uppercase tracking-normal">
              {summary}
            </p>
          )}
        </div>
      </div>

      <div className="w-[280px] h-[195px] md:w-full md:h-52 flex-shrink-0 bg-[#0a0a0a]/90 border border-light/10 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-xl transition-all duration-500 group-hover:border-light/30">
        
        <motion.div
          variants={scanVariants}
          className="absolute left-0 right-0 h-px bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)] z-20 pointer-events-none"
        />

        <div className="font-['Share_Tech_Mono'] text-[8px] text-light/50 tracking-wider z-10 select-none uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          PROJECT_ID: {slugify(title)}
        </div>

        <div className="flex-1 my-1.5 relative overflow-hidden border border-light/10 bg-black z-10 transition-transform duration-500 group-hover:scale-105">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="w-full h-full block overflow-hidden">
              <Image
                src={img}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500"
                draggable={false}
              />
            </a>
          ) : (
            <div className="w-full h-full block overflow-hidden">
              <Image
                src={img}
                alt={title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center font-['Share_Tech_Mono'] text-[8px] text-light/50 tracking-wider z-10 select-none uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>SYSTEM_READY</span>
        </div>

      </div>
    </motion.div>
    </div>
  );
};

export default function Projects({ isAppLoading = false }: { isAppLoading?: boolean }) {
  return (
    <>
      <Head>
        <title>Projects</title>
        <meta name="description" content="Yoel Ginting - Portfolio Projects" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </Head>

      <main
        className="mb-16 flex w-full flex-col items-center justify-center text-light"
      >
        <Layout className="pt-24 lg:pt-20">
          <SplitTextMori
            text="Projects"
            className="mb-2 !text-3xl !leading-tight lg:!text-6xl sm:!text-5xl xs:!text-3xl"
            isAppLoading={isAppLoading}
          />
          <p className="text-light/40 mb-12 text-center text-sm font-['Share_Tech_Mono'] uppercase tracking-wider">
            A selection of projects I've designed and developed
          </p>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <style>{`
              .project-list:hover .project-row {
                opacity: 0.50;
              }
              .project-list .project-row:hover {
                opacity: 1 !important;
              }
            `}</style>
            <div className="flex flex-col border-t border-light/10 project-list">
              <FeaturedProject
                num="01"
                type="Design & Development"
                tools="Next.js"
                title="Word Wide Global Indonesia"
                summary="Website company profile for PT. World Wide Global Indonesia, designed to showcase global logistics and import services."
                img={proj4}
                link="https://www.wwgimpor.id/"
              />
              <FeaturedProject
                num="02"
                type="Development"
                tools="React.js | Tailwind"
                title="Maritim X Academy"
                summary="An interactive online academy platform developed for Maritim Muda Nusantara, supporting maritime education."
                img={proj5}
                link="https://maritimx.id/"
              />
              <FeaturedProject
                num="03"
                type="Design & Development"
                tools="Next.js | CSS"
                title="Turbines HRIS"
                summary="A robust human resource information system built for Maritim Muda Nusantara to streamline administrative workflows."
                img={proj6}
                link="https://turbines.maritimepreneur.com/login"
              />
              <FeaturedProject
                num="04"
                type="Design & Development"
                tools="Vue.js | Laravel"
                title="DICEPATIN Logistics"
                summary="A comprehensive shipping and tracking application developed to check delivery rates and track courier shipments."
                img={proj3}
                link=""
              />
              <FeaturedProject
                num="05"
                type="Cloning Development"
                tools="Tailwind | HTML"
                title="Rinso.com Clone"
                summary="A responsive front-end clone of the official Rinso website, developed using Tailwind CSS for clean layout parity."
                img={proj2}
                link=""
              />
              <FeaturedProject
                num="06"
                type="Design & Development"
                tools="Vue.js | Laravel"
                title="Jaringan Doa Platform"
                summary="A community-focused spiritual platform designed for users to share and participate in mutual prayer networks."
                img={proj1}
                link=""
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 px-4 sm:px-6">
            <Article
              title="Adding more soon, thanks for the interest!"
              link="/"
            />
          </div>
        </Layout>
      </main>
    </>
  );
}
