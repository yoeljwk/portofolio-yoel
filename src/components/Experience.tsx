import React, { useRef, useEffect } from "react";
import { motion, useScroll, useMotionValue, useSpring, useTransform } from "framer-motion";
import LiIcon from "./LiIcon";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

interface DetailsProps {
  company: string;
  position: string;
  time: string;
  address?: string;
  work?: string;
  logo?: string;
}

const Details = ({ company, position, time, address, work, logo }: DetailsProps) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      className="my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-start justify-between md:w-[90%] sm:w-[95%]"
    >
      <LiIcon reference={ref} />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full"
      >
        <div 
          className="bg-gradient-to-br from-dark/80 to-dark/40 border border-light/20 rounded-xl p-6 sm:p-4 backdrop-blur-sm hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-white/20"
          style={{ filter: "url(#chromatic-distortion)" }}
        >
          <div className="flex items-start gap-6 md:gap-4 sm:gap-3 sm:flex-col">
            {logo && (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-14 md:h-14 sm:w-12 sm:h-12 rounded-xl bg-light/10 p-3 sm:p-2 flex items-center justify-center border border-light/10">
                  <Image
                    src={logo}
                    alt={company}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0 sm:w-full">
              <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-1 mb-1">
                <h3 className="font-bold text-xl sm:text-lg xs:text-base text-light">
                  {company}
                </h3>
                <span className="text-light/60 text-sm xs:text-xs whitespace-nowrap">
                  {time}
                </span>
              </div>
              <p className="text-gray-400 font-semibold text-base sm:text-sm xs:text-xs mb-3">
                {position}
              </p>
              {work && (
                <div className="p-4 sm:p-3 mt-4 rounded-lg bg-light/5 border border-light/10">
                  <p className="text-sm md:text-xs sm:text-xs text-light/80 leading-relaxed">
                    {work}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const MagneticLink = ({ href, children, className = "" }: MagneticLinkProps) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [springConfig, setSpringConfig] = React.useState({ stiffness: 150, damping: 15, mass: 0.6 });
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const labelX = useTransform(springX, (val) => val * 0.4);
  const labelY = useTransform(springY, (val) => val * 0.4);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relativeX = e.clientX - centerX;
    const relativeY = e.clientY - centerY;

    setSpringConfig({ stiffness: 180, damping: 20, mass: 0.4 });
    x.set(relativeX * 0.35);
    y.set(relativeY * 0.35);
  };

  const handleMouseLeave = () => {
    setSpringConfig({ stiffness: 100, damping: 8, mass: 0.8 });
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={zoneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-center cursor-pointer relative"
      style={{
        width: "220px",
        height: "100px",
      }}
    >
      <Link href={href} passHref legacyBehavior>
        <motion.a
          style={{
            x: springX,
            y: springY,
            transformStyle: "preserve-3d",
          }}
          className={`${className} relative z-10 flex items-center justify-center`}
        >
          <motion.span
            style={{
              x: labelX,
              y: labelY,
            }}
            className="select-none pointer-events-none"
          >
            {children}
          </motion.span>
        </motion.a>
      </Link>
    </div>
  );
};

const Experience = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const clamp = gsap.utils.clamp(-2000, 2000);
    const velocityProxy = { v: 0, s: 0 }; // v = signed, s = strength (0..1)

    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate(self: any) {
        const raw = clamp(self.getVelocity());
        const norm = raw / 1000; // ~ -2..2
        const strength = Math.min(1.5, Math.abs(norm));

        if (Math.abs(strength) > Math.abs(velocityProxy.s)) {
          velocityProxy.v = norm;
          velocityProxy.s = strength;
          
          gsap.to(velocityProxy, {
            v: 0,
            s: 0,
            duration: 2, 
            ease: "power2.out",
            overwrite: true
          });
        }
      }
    });

    const tick = () => {
      const displacementEl = document.getElementById("displacement-map");
      const redOffsetEl = document.getElementById("red-offset");
      const blueOffsetEl = document.getElementById("blue-offset");

      if (displacementEl) {
        displacementEl.setAttribute("scale", (velocityProxy.s * 6).toString());
      }
      if (redOffsetEl) {
        redOffsetEl.setAttribute("dx", (-velocityProxy.v * 2.5).toString());
      }
      if (blueOffsetEl) {
        blueOffsetEl.setAttribute("dx", (velocityProxy.v * 2.5).toString());
      }
    };

    gsap.ticker.add(tick);

    return () => {
      trigger.kill();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="my-2">
      <h2 className="font-bold text-4xl mb-16 w-full text-center md:text-6xl xs:text-4xl md:mb-8 sm:!text-2xl xs:!text-2xl">
        Experience
      </h2>

      <div ref={ref} className="relative w-[75%] mx-auto lg:w-[90%] md:w-full sm:px-4">
        <motion.div
          className="absolute left-9 top-0 w-[4px] md:w-[2px] md:left-[30px] xs:left-[20px] h-full bg-primaryDark shadow-3xl 
            origin-top"
          style={{ scaleY: scrollYProgress }}
        />

        <ul className="w-full flex flex-col items-start justify-between ml-4 xs:ml-2">
          <Details
            company="Maritim Muda Nusantara"
            position="Web Developer"
            time="Des 2025 – Jun 2026"
            work="Developing and maintaining websites"
            logo="/images/logo-maritim.png"
          />
          <Details
            company="SDA Media"
            position="Fullstack Developer"
            time="2024 - 2024"
            work="Developing and maintaining websites using Laravel and MySQL. Collaborating in project planning, code reviews, and sprint planning. Active in technical requirements meetings and using GitLab for version control. Contributing to application testing with focus on bug identification and performance improvements."
            logo="/images/logo-sda.png"
          />
          <Details
            company="Bangkit Academy"
            position="Cloud Engineer Cohort"
            time="Feb 2024 – July 2024"
            work="Led by Google, Tokopedia, Gojek, & Traveloka. Intensive program focused on cloud computing technologies and best practices."
            logo="/images/logo-bangkit.png"
          />
          <Details
            company="Universitas Advent Indonesia"
            position="Dormitory Monitor"
            time="2021 - 2023"
            work="Monitored and maintained orderliness of students living in the men's dormitory, ensuring a conducive living environment."
            logo="/images/logo-unai.png"
          />
        </ul>
      </div>

      <div className="mt-40 sm:mt-20 flex items-center justify-between gap-3">
        <MagneticLink
          href="/projects/"
          className={`flex items-center rounded-lg border-2 border-solid bg-dark p-2.5 px-6 text-lg font-semibold
            capitalize text-light hover:border-light hover:bg-light hover:text-dark 
            md:p-2 md:px-4 md:text-base sm:text-sm sm:px-3 sm:py-2
             `}
        >
          View Project
        </MagneticLink>
      </div>


      <svg style={{ position: "absolute", width: 0, height: 0 }} width="0" height="0">
        <defs>
          <filter id="chromatic-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="distorted" id="displacement-map" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" in="distorted" result="red" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" in="distorted" result="green" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" in="distorted" result="blue" />
            <feOffset dx="0" dy="0" in="red" result="red-off" id="red-offset" />
            <feOffset dx="0" dy="0" in="green" result="green-off" />
            <feOffset dx="0" dy="0" in="blue" result="blue-off" id="blue-offset" />
            <feBlend mode="screen" in="red-off" in2="green-off" result="rg" />
            <feBlend mode="screen" in="rg" in2="blue-off" result="rgb" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Experience;
