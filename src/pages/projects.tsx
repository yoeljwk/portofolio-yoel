import AnimatedText from "@/components/AnimatedText";
import { GithubIcon } from "@/components/Icons";
import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SplitTextMori from "@/components/SplitTextMori";

import proj1 from "../../public/images/projects/jaringan-doa.png";
import proj2 from "../../public/images/projects/clone-rinso.png";
import proj3 from "../../public/images/projects/dicepatin.png";
import proj4 from "../../public/images/projects/wwgi.png";
import proj5 from "../../public/images/projects/MaritimX.png";
import proj6 from "../../public/images/projects/turbines.png";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const FramerImage = motion(Image);

interface MovingImgProps {
  title: string;
  img: any;
  link: string;
}

const MovingImg = ({ title, img, link }: MovingImgProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgRef = useRef<HTMLImageElement>(null);

  function handleMouse(event: React.MouseEvent) {
    if (imgRef.current) {
      imgRef.current.style.display = "inline-block";
    }
    x.set(event.pageX);
    y.set(-10);
  }

  function handleMouseLeave(event: React.MouseEvent) {
    if (imgRef.current) {
      imgRef.current.style.display = "none";
    }
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
            x: x as any,
            y: y as any,
          }}
          sizes="(max-width: 768px) 60vw,
              (max-width: 1200px) 40vw,
              33vw"
        />
      </Link>
    </>
  );
};

interface ArticleProps {
  title: string;
  img?: any;
  date?: string;
  link?: string;
}

const Article = ({ img, title, date, link }: ArticleProps) => {
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

interface FeaturedProjectProps {
  type: string;
  title: string;
  summary: string;
  img: any;
  link: string;
  tools: string;
}

const FeaturedProject = ({
  type,
  title,
  summary,
  img,
  link,
  tools
}: FeaturedProjectProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateXTransform = useTransform(y, [0, 1], [15, -15]); 
  const rotateYTransform = useTransform(x, [0, 1], [-15, 15]); 
  const innerXTransform = useTransform(x, [0, 1], [-10, 10]); 
  const innerYTransform = useTransform(y, [0, 1], [-10, 10]); 

  const rotateX = useSpring(rotateXTransform, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rotateYTransform, { stiffness: 150, damping: 20 });
  const innerX = useSpring(innerXTransform, { stiffness: 150, damping: 20 });
  const innerY = useSpring(innerYTransform, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="w-full h-full"
    >
      <Link href={link} passHref legacyBehavior>
        <motion.a
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="rounded-2xl border border-light/20 bg-dark p-4 flex flex-col hover:cursor-pointer transition-colors duration-300 h-[320px] sm:h-auto select-none"
        >
          <motion.div
            style={{
              x: innerX,
              y: innerY,
              transformStyle: "preserve-3d",
            }}
            className="flex flex-col h-full w-full"
          >
            <div 
              style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} 
              className="flex-1 overflow-hidden rounded-lg mb-3 relative"
            >
              <Image
                src={img}
                alt={title}
                width={500}
                height={300}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
            <div style={{ transform: "translateZ(15px)" }}>
              <h2 className="font-bold text-base sm:text-sm text-light">{title}</h2>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-light/20 bg-light/5 text-light/80">{type}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-light/20 bg-light/5 text-light/80">{tools}</span>
              </div>
              {summary && <p className="text-light/60 text-xs mt-2 sm:text-[11px]">{summary}</p>}
            </div>
          </motion.div>
        </motion.a>
      </Link>
    </motion.div>
  );
};


export default function Projects({ isAppLoading = false }: { isAppLoading?: boolean }) {
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
          <SplitTextMori
            text="Projects"
            className="mb-2 !text-3xl !leading-tight lg:!text-6xl sm:!text-5xl xs:!text-3xl"
            isAppLoading={isAppLoading}
          />
          <p className="text-light/60 mb-12 text-center">
            A selection of projects I've designed and developed
          </p>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1 sm:gap-4">
              <FeaturedProject
                type="Development"
                tools="CI"
                title="Word Wide Global Indonesia"
                summary="Website PT. World Wide Global Indonesia"
                img={proj4}
                link="https://www.wwgimpor.id/"
              />
              <FeaturedProject
                type="Development"
                tools="React.js"
                title="Maritim X Academy"
                summary="Website untuk platform pendidikan oleh maritim muda nusantara"
                img={proj5}
                link="https://maritimx.id/"
              />
              <FeaturedProject
                type="Design & Development"
                tools="Next.js"
                title="Turbines"
                summary="Website HRIS untuk maritim muda nusantara"
                img={proj6}
                link="https://turbines.maritimepreneur.com/login"
              />
              <FeaturedProject
                type="Design & Development"
                tools="Vue.js | Laravel"
                title="DICEPATIN"
                summary="Aplikasi cek pengiriman barang"
                img={proj3}
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
                title="Jaringan Doa"
                summary="Platform jaringan doa untuk saling mendoakan"
                img={proj1}
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
