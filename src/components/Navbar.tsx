import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import gsap from "gsap";  
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Instagram, Home, User, Folder, BookOpen, MessageSquare, Terminal, ChevronDown } from "lucide-react";

interface NavbarProps {
  navMode?: "sidebar" | "navbar";
  setNavMode?: (mode: "sidebar" | "navbar") => void;
}

const CustomLink = ({ href, title, className = "" }) => {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={`${className}  rounded relative group text-light`}
    >
      {title}
      <span
        className={`
              inline-block h-[1px]  bg-light absolute left-0 -bottom-0.5 
              group-hover:w-full transition-[width] ease duration-300
              ${
                router.asPath === href ? "w-full" : " w-0"
              }
              `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

const mobileLinks = [
  { href: "/", title: "Home", icon: Home },
  { href: "/about", title: "About", icon: User },
  { href: "/projects", title: "Projects", icon: Folder },
  { href: "/blog", title: "Blog", icon: BookOpen },
  { href: "/guestbook", title: "Guestbook", icon: MessageSquare },
];

const CustomMobileLink = ({ href, title, icon: Icon, toggle }) => {
  const router = useRouter();
  const isActive = router.asPath === href;

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200 group dropdown-item
        ${
          isActive
            ? "bg-white/10 text-light font-semibold"
            : "text-light/65 hover:text-light hover:bg-white/5"
        }
      `}
    >
      <Icon size={16} className={`transition-colors duration-200 ${isActive ? "text-light" : "text-light/40 group-hover:text-light"}`} />
      <span className="text-sm">
        {title}
      </span>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#ba8fff] ml-auto shadow-[0_0_8px_#ba8fff]" />
      )}
    </motion.button>
  );
};

const Navbar = ({ navMode, setNavMode }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!menuRef.current || !backdropRef.current) return;

    const items = menuRef.current.querySelectorAll(".dropdown-item");

    if (isOpen) {
      // Open animation
      gsap.killTweensOf([menuRef.current, backdropRef.current, arrowRef.current, items]);
      
      gsap.timeline()
        .to(backdropRef.current, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out"
        }, 0)
        .to(arrowRef.current, {
          rotation: 180,
          duration: 0.9,
          ease: "elastic.out(1.2, 0.3)"
        }, 0)
        .fromTo(menuRef.current, 
          { autoAlpha: 0, yPercent: -30, scale: 0.7 },
          { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1, ease: "elastic.out(1.2, 0.3)" },
          0
        )
        .fromTo(items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.07 },
          0.1
        );
    } else {
      // Close animation
      gsap.killTweensOf([menuRef.current, backdropRef.current, arrowRef.current, items]);

      gsap.timeline()
        .to(backdropRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.inOut"
        }, 0)
        .to(arrowRef.current, {
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut"
        }, 0)
        .to(menuRef.current, {
          autoAlpha: 0,
          yPercent: -20,
          scale: 0.8,
          duration: 0.4,
          ease: "power3.in"
        }, 0)
        .to(items, {
          opacity: 0,
          x: -10,
          duration: 0.3,
          stagger: 0.03
        }, 0);
    }
  }, [isOpen]);

  return (
    <header
      className="w-full max-w-full flex items-center justify-between px-32 pt-6 pb-6 font-medium text-light
    lg:px-8 md:px-6 sm:px-4 lg:pt-4 lg:pb-4 fixed top-0 left-0 right-0 z-40 bg-transparent"
    >
      <Link
        href="/"
        className="font-bold text-xl hidden z-[60] relative text-light"
      >
        Yoel Ginting
      </Link>

      <button
        type="button"
        className="hidden lg:flex items-center gap-2 px-4 py-2 border border-light/25 rounded-lg text-light hover:bg-white/5 transition-colors duration-200 font-semibold text-sm ml-auto z-[60] relative animate-none"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        onClick={handleClick}
      >
        <span>Menu</span>
        <span ref={arrowRef} className="inline-block">
          <ChevronDown size={14} />
        </span>
      </button>

      <div className="w-full flex justify-center items-center lg:hidden">
        <div className="relative ">
          <nav className="relative flex items-center justify-center bg-dark shadow-lg rounded-xl px-8 py-3 border border-solid border-light z-10">
            <CustomLink className="mr-4" href="/" title="Home" />
            <CustomLink className="mx-4" href="/about" title="About" />
            <CustomLink className="mx-4" href="/projects" title="Projects" />
            <CustomLink className="mx-4" href="/blog" title="Blog" />
            <CustomLink className="mx-4" href="/guestbook" title="Guestbook" />
            {setNavMode && (
              <button 
                onClick={() => setNavMode("sidebar")}
                title="Switch to IDE Mode"
                className="ml-4 text-light/60 hover:text-[#ba8fff] hover:scale-110 transition-all duration-200 cursor-pointer flex items-center justify-center p-1 rounded-lg"
              >
                <Terminal size={18} />
              </button>
            )}
          </nav>
          <motion.div
            className="absolute left-36 top-1.5 -translate-y-1/2 ml-4 whitespace-nowrap font-bold text-4xl text-light pointer-events-none"
            animate={{ x: [0, 0, 390, 390, 0] }}
            transition={{
              duration: 14,
              times: [0, 0.25, 0.55, 0.7, 1],
              repeat: Infinity,
              repeatDelay: 0,
              ease: "easeInOut"
            }}
          >
            Yoel Ginting
          </motion.div>
        </div>
      </div>
      
      <div
        ref={backdropRef}
        onClick={handleClick}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        style={{ visibility: "hidden", opacity: 0 }}
      />

      <div
        ref={menuRef}
        style={{ transformOrigin: "top right", visibility: "hidden", opacity: 0 }}
        className="absolute top-[calc(100%-8px)] right-8 md:right-6 sm:right-4 z-50 w-[85vw] max-w-[190px] bg-dark border border-light/20 rounded-xl shadow-2xl p-2.5 backdrop-blur-md"
      >
        <div className="flex flex-col gap-1">
          {mobileLinks.map((link) => (
            <CustomMobileLink
              key={link.href}
              toggle={handleClick}
              href={link.href}
              title={link.title}
              icon={link.icon}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-[50%] top-2 translate-x-[-50%] lg:hidden">
        <Logo />
      </div>
    </header>
  );
};

export default Navbar;
