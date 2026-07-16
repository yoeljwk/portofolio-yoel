import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import profab from "../../public/images/profile/profilecard.png";
import bgImage from "../../public/images/background.jpg";
import { useInView, useMotionValue, useSpring, motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import TypingCode from "@/components/TypingCode";
import SplitTextMori from "@/components/SplitTextMori";
import ScrambleText from "@/components/ScrambleText";

interface Position {
  x: number;
  y: number;
  rotate: number;
}

const FloatingImages = ({ isHovered }: { isHovered: boolean }) => {
  const [positions, setPositions] = useState<Position[]>([]);

  const images = [
    { src: "/images/shape/shapehtml.png", side: "left", index: 0 },
    { src: "/images/shape/shapecss.png", side: "left", index: 1 },
    { src: "/images/shape/shapefigma.png", side: "left", index: 2 },
    { src: "/images/shape/shapereaact.png", side: "right", index: 0 },
    { src: "/images/shape/shapenext.png", side: "right", index: 1 },
    { src: "/images/shape/shapevscode.png", side: "right", index: 2 },
  ];

  useEffect(() => {
    if (isHovered) {
      const isMobile = window.innerWidth < 768;
      const spreadX = isMobile ? 120 : 300;
      const spreadY = isMobile ? 80 : 120;
      const randomness = isMobile ? 30 : 70;

      const newPositions = images.map((img, idx) => {
        const baseX = img.side === "left" ? -(spreadX + (isMobile ? 20 : 50)) : spreadX;
        const baseY = (img.index - 1) * spreadY;
        const randomX = baseX + (Math.random() - 0.5) * randomness;
        const randomY = baseY + (Math.random() - 0.5) * randomness;
        const randomRotate = (Math.random() - 0.5) * 30;
        return { x: randomX, y: randomY, rotate: randomRotate };
      });
      setPositions(newPositions);
    }
  }, [isHovered]);

  return (
    <>
      {images.map((img, i) => {
        const pos = positions[i] || { x: 0, y: 0, rotate: 0 };

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-12 md:h-12 pointer-events-none z-0"
            animate={{
              x: isHovered ? pos.x : 0,
              y: isHovered ? pos.y : 0,
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
              rotate: isHovered ? pos.rotate : 0,
            }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: isHovered ? img.index * 0.1 : 0,
            }}
          >
            <Image
              src={img.src}
              alt="shape"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        );
      })}
    </>
  );
};

function AnimatedNumberFramerMotion({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(
    () =>
      springValue.on("change", (latest: number) => {
        if (ref.current && Number(latest.toFixed(0)) <= value) {
          ref.current.textContent = latest.toFixed(0);
        }
      }),
    [springValue, value],
  );

  return <span ref={ref} />;
}

export default function About({ isAppLoading = false, experiences = [] }: { isAppLoading?: boolean; experiences: any[] }) {
  const [activeView, setActiveView] = useState("vscode");
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(125);
  const mouseY = useMotionValue(125);

  const rotateXTransform = useTransform(mouseY, (val) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const height = rect?.height || 250;
    const normY = val / height;
    return 15 - normY * 30;
  });

  const rotateYTransform = useTransform(mouseX, (val) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const width = rect?.width || 250;
    const normX = val / width;
    return -15 + normX * 30;
  });

  const innerXTransform = useTransform(mouseX, (val) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const width = rect?.width || 250;
    const normX = val / width;
    return -10 + normX * 20;
  });

  const innerYTransform = useTransform(mouseY, (val) => {
    const rect = cardRef.current?.getBoundingClientRect();
    const height = rect?.height || 250;
    const normY = val / height;
    return -10 + normY * 20;
  });

  const rotateX = useSpring(rotateXTransform, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rotateYTransform, { stiffness: 150, damping: 20 });
  const innerX = useSpring(innerXTransform, { stiffness: 150, damping: 20 });
  const innerY = useSpring(innerYTransform, { stiffness: 150, damping: 20 });

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    mouseX.set(localX);
    mouseY.set(localY);

    setMousePosition({
      x: localX,
      y: localY,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    } else {
      mouseX.set(125);
      mouseY.set(125);
    }
  };

  return (
    <>
      <Head>
        <title>About | Yoel Ginting</title>
        <meta
          name="description"
          content="Learn more about Yoel Ginting — Web Developer passionate about building responsive and engaging web applications."
        />
      </Head>

      <div className={`w-full min-h-screen text-light grain-bg`}>
        <Layout className="pt-16 !bg-transparent">
          <div className="max-w-7xl mx-auto w-full">
            <SplitTextMori
              text="About"
              className="mb-2 !text-3xl !leading-tight lg:!text-6xl sm:!text-5xl xs:!text-3xl text-light"
              isAppLoading={isAppLoading}
            />
            <p className="text-light/60 mb-12 text-center">
              More about who I am
            </p>

            <div className="grid w-full grid-cols-8 gap-16 sm:gap-8 md:gap-6">
              <div
                className="col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 
              md:col-span-8 min-h-[630px] md:min-h-0"
              >

                <div className="flex gap-3 mb-6 md:gap-2">
                  <button
                    onClick={() => setActiveView("vscode")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all md:px-3 md:py-1.5 md:text-sm ${activeView === "vscode"
                      ? "bg-[#007acc] text-white"
                      : "bg-dark border-2 border-light/20 text-light hover:border-[#007acc]"
                      }`}
                  >
                    VS Code
                  </button>
                  <button
                    onClick={() => setActiveView("run")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all md:px-3 md:py-1.5 md:text-sm ${activeView === "run"
                      ? "bg-[#16a34a] text-white"
                      : "bg-dark border-2 border-light/20 text-light hover:border-[#16a34a]"
                      }`}
                  >
                    Run
                  </button>
                </div>

                <motion.div style={{ opacity }} className="w-full">
                  <AnimatePresence mode="wait">
                    {activeView === "vscode" ? (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                      >
                        <TypingCode />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="biography"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                      >
                        <h2 className="mb-4 text-lg font-bold uppercase text-light/75">
                          BIOGRAPHY
                        </h2>
                        <p className="font-medium ">
                          <ScrambleText text="Web Developer who is experienced in building responsive and engaging web applications. Skilled in implementing UI/UX designs into clean and efficient code, and actively collaborating across teams to create digital solutions that enhance the user experience. Enthusiastic about technology, always up to date with the latest developments, and known for creativity and thoroughness in solving problems. Ready to make a real contribution in every project that is carried out." />
                        </p>
                        <p className="my-4 font-medium">
                          <ScrambleText text="P.s I like playing music and sports✌️." delay={300} />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div
                className="relative col-span-3 h-max w-full flex items-start justify-end
              xl:col-span-4 md:col-span-8 md:order-1 translate-x-48 md:translate-x-0 md:justify-center
              "
              >
                <div
                  ref={cardRef}
                  className="relative w-full max-w-xs mt-20 xl:translate-x-0 md:mt-0 md:max-w-[250px] sm:max-w-[200px]"
                  style={{ perspective: 1000 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <FloatingImages isHovered={isHovered} />
                  {isHovered && (
                    <motion.div
                      className="absolute pointer-events-none z-30 bg-black/90 text-light px-4 py-2 rounded-lg text-base font-bold overflow-hidden"
                      style={{
                        left: mousePosition.x + 10,
                        top: mousePosition.y - 10,
                        width: '100px',
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="whitespace-nowrap animate-slide-text">
                        {'HELLO'.split('').map((char, i) => (
                          <span
                            key={i}
                            className="inline-block animate-bounce-char"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    style={{
                      opacity,
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      style={{
                        x: innerX,
                        y: innerY,
                        transformStyle: "preserve-3d",
                      }}
                      className="w-full h-full"
                    >
                      <div style={{ transform: "translateZ(30px)" }}>
                        <Image
                          className="h-auto w-full relative z-20 profile-img"
                          priority={true}
                          src={profab}
                          alt="Yoel Ginting"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
              <div
                className="col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row 
              xl:items-center md:order-3"
              ></div>
            </div>
            <Skills />
            <Experience experiences={experiences} />
          </div>
        </Layout>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const { db } = await import("@/lib/firebase");
    const { collection, getDocs, query, orderBy } = await import("firebase/firestore");

    const experiencesCollection = collection(db, "experiences");
    const q = query(experiencesCollection, orderBy("display_order", "asc"));
    const snapshot = await getDocs(q);

    const experiences = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        company: data.company || "",
        position: data.position || "",
        time: `${data.start_date || ""} – ${data.end_date || ""}`,
        work: data.description || "",
        logo: data.thumbnail || (data.company ? `/images/logo-${String(data.company).toLowerCase().replace(/\s+/g, "")}.png` : ""),
      };
    });

    return {
      props: {
        experiences
      },
      revalidate: 60
    };
  } catch (error) {
    console.error("Failed to fetch experiences for static props:", error);
    return {
      props: {
        experiences: []
      },
      revalidate: 10
    };
  }
}

