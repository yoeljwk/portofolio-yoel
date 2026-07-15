import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import gsap from "gsap";

interface FooterProps {
  navMode?: "sidebar" | "navbar";
  isSidebarOpen?: boolean;
}

const Footer = ({ navMode = "navbar", isSidebarOpen = false }: FooterProps) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const down = "M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z";
      const center = "M0-0.3C0-0.3,464,0,1139,0S2278-0.3,2278-0.3V683H0V-0.3z";

      const downLine = "M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3";
      const centerLine = "M0-0.3C0-0.3,464,0,1139,0S2278-0.3,2278-0.3";

      gsap.set("#bouncy-path", { attr: { d: center } });
      gsap.set("#bouncy-path-line", { attr: { d: centerLine } });

      let lastTriggerTime = 0;

      const trigger = ScrollTrigger.create({
        trigger: ".footer",
        start: "top bottom",
        onEnter: (self) => {
          const now = Date.now();
          if (now - lastTriggerTime < 500) return; 
          lastTriggerTime = now;

          const velocity = self.getVelocity();
          const variation = Math.min(Math.max(velocity / 10000, -0.3), 0.5);

          gsap.fromTo(
            "#bouncy-path",
            { attr: { d: down } },
            {
              duration: 1.5,
              attr: { d: center },
              ease: `elastic.out(${1 + variation}, ${0.6 - variation * 0.2})`,
              overwrite: "auto",
            }
          );

          gsap.fromTo(
            "#bouncy-path-line",
            { attr: { d: downLine } },
            {
              duration: 1.5,
              attr: { d: centerLine },
              ease: `elastic.out(${1 + variation}, ${0.6 - variation * 0.2})`,
              overwrite: "auto",
            }
          );
        },
      });

      return () => {
        trigger.kill();
      };
    }
  }, []);

  const bgClass = navMode === "sidebar"
    ? isSidebarOpen
      ? "ml-[-270px] lg:ml-[-50px] w-[calc(100%+270px)] lg:w-[calc(100%+50px)]"
      : "ml-[-50px] w-[calc(100%+50px)]"
    : "ml-0 w-full";

  return (
    <footer className="footer relative w-full max-w-full overflow-visible bg-transparent text-gray-300 mt-24">
  
      <div className={`absolute inset-y-0 left-0 ${bgClass} overflow-visible pointer-events-none z-0 transition-all duration-300`}>
        <svg
          id="footer-img"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2278 683"
          className="w-full h-full block overflow-visible"
        >
          <defs>
            <linearGradient id="grad-1" x1="0" y1="0" x2="2278" y2="683" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#000000ff" stopOpacity="0.45" />
              <stop offset="0.6" stopColor="#141414ff" stopOpacity="0.85" />
              <stop offset="1" stopColor="#000000ff" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <path
            id="bouncy-path"
            fill="url(#grad-1)"
            d="M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V683H0V-0.3z"
          />
          <path
            id="bouncy-path-line"
            fill="none"
            stroke="#ffffffff"
            strokeWidth="2"
            strokeLinecap="round"
            d="M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3"
          />
        </svg>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-8 sm:px-4">
        <div className="grid grid-cols-4 gap-8 lg:grid-cols-2 md:grid-cols-1 md:gap-6">
          <div>
            <h3 className="text-light font-semibold text-sm mb-2">
              About Us
            </h3>
            <p className="text-sm leading-relaxed">
              A portfolio by Yoel Ginting showcasing projects and skills.
            </p>
          </div>
          <div>
            <h3 className="text-light font-semibold text-sm mb-2">
              General
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-purple-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm hover:text-purple-400 transition-colors"
                >
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-light font-semibold text-sm mb-2">
              Connect
            </h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://github.com/yoelgntng18"
                className="hover:text-purple-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/yoel-ginting-9912462ab/"
                className="hover:text-purple-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/yoelgntng/"
                className="hover:text-purple-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-sm mb-3">Subscribe to our newsletter</p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-row gap-2 sm:flex-col"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 text-sm bg-transparent border border-gray-600 rounded-full focus:outline-none focus:border-cyan-400 sm:w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-dark text-white rounded-full hover:bg-red-500 transition-colors whitespace-nowrap sm:w-full"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-6 flex flex-col items-center">
          <div className="relative w-64 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          </div>
          <p className="text-sm">© 2026 Yoel Ginting.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
