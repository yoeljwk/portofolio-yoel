import Layout from "@/components/Layout";
import Head from "next/head";
import Image from "next/image";
import profab from "../../public/images/profile/profilecard.png";
import bgImage from "../../public/images/background.jpg";
import { useInView, useMotionValue, useSpring, motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import AnimatedText from "@/components/AnimatedText";
import TypingCode from "@/components/TypingCode";

const FloatingImages = ({ isHovered }) => {
  const [positions, setPositions] = useState([]);
  
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


function AnimatedNumberFramerMotion({ value }) {
  const ref = useRef(null);
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
      springValue.on("change", (latest) => {
        if (ref.current && latest.toFixed(0) <= value) {
          ref.current.textContent = latest.toFixed(0);
        }
      }),
    [springValue, value],
  );

  return <span ref={ref} />;
}

export default function About() {
  const [activeView, setActiveView] = useState("vscode");
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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

      <div className={`w-full min-h-screen text-light`}>
        <Layout className="pt-16 !bg-transparent">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatedText
              text="Get to know me"
              className="mb-16 !text-3xl !leading-tight lg:!text-7xl sm:!text-6xl xs:!text-xl text-blue-500 sm:mb-8"
            />

            <div className="grid w-full grid-cols-8 gap-16 sm:gap-8 md:gap-6">
              <div
                className="col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 
              md:col-span-8 min-h-[630px] md:min-h-0"
              >
                {/* Toggle Buttons */}
                <div className="flex gap-3 mb-6 md:gap-2">
                  <button
                    onClick={() => setActiveView("vscode")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all md:px-3 md:py-1.5 md:text-sm ${
                      activeView === "vscode"
                        ? "bg-[#007acc] text-white"
                        : "bg-dark border-2 border-light/20 text-light hover:border-[#007acc]"
                    }`}
                  >
                    VS Code
                  </button>
                  <button
                    onClick={() => setActiveView("run")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all md:px-3 md:py-1.5 md:text-sm ${
                      activeView === "run"
                        ? "bg-[#16a34a] text-white"
                        : "bg-dark border-2 border-light/20 text-light hover:border-[#16a34a]"
                    }`}
                  >
                    Run
                  </button>
                </div>

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
                        Web Developer who is experienced in building responsive
                        and engaging web applications. Skilled in implementing
                        UI/UX designs into clean and efficient code, and
                        actively collaborating across teams to create digital
                        solutions that enhance the user experience. Enthusiastic
                        about technology, always up to date with the latest
                        developments, and known for creativity and thoroughness
                        in solving problems. Ready to make a real contribution
                        in every project that is carried out.
                      </p>
                      <p className="my-4 font-medium">
                        P.s I like playing music and sports✌️.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div
                className="relative col-span-3 h-max w-full flex items-start justify-end
              xl:col-span-4 md:col-span-8 md:order-1 translate-x-48 md:translate-x-0 md:justify-center
              "
              >
                <div
                  className="relative w-full max-w-xs mt-20 xl:translate-x-0 md:mt-0 md:max-w-[250px] sm:max-w-[200px]"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
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
                    animate={{ y: [0, -20, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      className="h-auto w-full relative z-20"
                      priority={true}
                      src={profab}
                      alt="Yoel Ginting"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                </div>
              </div>
              <div
                className="col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row 
              xl:items-center md:order-3"
              ></div>
            </div>
            <Skills />
            <Experience />
          </div>
        </Layout>
      </div>
    </>
  );
}
