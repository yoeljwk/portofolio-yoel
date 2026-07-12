import AnimatedText from "@/components/AnimatedText";
import { GithubIcon } from "@/components/Icons";
import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import proj1 from "../../public/images/projects/jaringan-doa.png";
import proj2 from "../../public/images/projects/clone-rinso.png";
import proj3 from "../../public/images/projects/dicepatin.png";

import { motion, useMotionValue } from "framer-motion";

const FramerImage = motion(Image);

const MovingImg = ({ title, img, link }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef(null);

  function handleMouse(event) {
    imgRef.current.style.display = "inline-block";
    x.set(event.pageX);
    y.set(-10);
  }

  function handleMouseLeave(event) {
    imgRef.current.style.display = "none";
    x.set(0);
    y.set(0);
  }
  return (
    <>
      <Link
        href={link}
        target={"_blank"}
        className="relative"
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
      >
        <h2 className="capitalize text-xl font-semibold hover:underline text-light md:text-lg xs:text-base sm:self-start">
          {title}
        </h2>
        <FramerImage
          src={img}
          ref={imgRef}
          alt={title}
          className="w-96 h-auto z-10 hidden absolute rounded-lg md:!hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { duration: 0.2 } }}
          style={{
            x: x,
            y: y,
          }}
          sizes="(max-width: 768px) 60vw,
              (max-width: 1200px) 40vw,
              33vw"
        />
      </Link>
    </>
  );
};

const Article = ({ img, title, date, link }) => {
  return (
    <motion.li
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1, transition: { duration: 0.4 } }}
      viewport={{ once: true }}
      className="w-full p-6 rounded-lg bg-dark/50 border border-light/10 backdrop-blur-sm"
    >
      <p className="text-lg text-light/70 text-center">{title}</p>
    </motion.li>
  );
};

const FeaturedProject = ({
  type,
  title,
  summary,
  img,
  link,
  tools
}) => {
  return (
    <Link
      href={link}
      className="rounded-2xl border border-light/20 bg-dark p-4 flex flex-col hover:cursor-pointer transition-all hover:scale-[1.03] h-[320px] sm:h-auto"
    >
      <div className="flex-1 overflow-hidden rounded-lg mb-3">
        <Image
          src={img}
          alt={title}
          width={500}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="font-bold text-base sm:text-sm">{title}</h2>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-light/20 bg-light/5">{type}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-light/20 bg-light/5">{tools}</span>
        </div>
        {summary && <p className="text-light/60 text-xs mt-2 sm:text-[11px]">{summary}</p>}
      </div>
    </Link>
  );
};


export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects</title>
        <meta name="description" content="" />
      </Head>

      <main
        className={`mb-16  flex w-full flex-col items-center justify-center text-light`}
      >
        <Layout className="pt-16">
          <AnimatedText
            text="Projects ✨"
            className="mb-12 !text-xl !leading-tight lg:!text-6xl sm:mb-8 sm:!text-5xl xs:!text-3xl"
          />
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1 sm:gap-4">
              <FeaturedProject
                type="Design & Development"
                tools="Vue.js | Laravel"
                title="Jaringan Doa"
                summary="Platform jaringan doa untuk saling mendoakan"
                img={proj1}
                link=""
              />
              <FeaturedProject
                type="Clonning Development"
                tools="Tailwind | Bootstrap"
                title="Clonning Website Rinso.com"
                summary="Clone website Rinso dengan Tailwind CSS"
                img={proj2}
                link=""
              />
              <FeaturedProject
                type="Design & Development"
                tools="Vue.js | Laravel"
                title="DICEPATIN"
                summary="Aplikasi cek paten Indonesia"
                img={proj3}
                link=""
              />
            </div>
          </div>
          <div className="mt-16 text-center space-y-6 px-4 sm:px-6 sm:mt-12">
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
