import Link from "next/link";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Instagram, Home, User, Folder, BookOpen, MessageSquare } from "lucide-react";

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

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  return (
    <motion.button
      variants={itemVariants}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-colors duration-200 group
        ${
          isActive
            ? "text-light font-semibold"
            : "text-light/65 hover:text-light"
        }
      `}
    >
      <Icon size={16} className={`transition-colors duration-200 ${isActive ? "text-light" : "text-light/40 group-hover:text-light"}`} />
      <span className="text-sm">
        {title}
      </span>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-light ml-auto" />
      )}
    </motion.button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className="w-full max-w-full flex items-center justify-between px-32 pt-6 pb-6 font-medium text-light
    lg:px-8 md:px-6 sm:px-4 lg:pt-4 lg:pb-4 fixed top-0 left-0 right-0 z-40 bg-transparent"
    >
      <Link
        href="/"
        className="font-bold text-xl hidden lg:block z-[60] relative text-light"
      >
        Yoel Ginting
      </Link>

      <button
        type="button"
        className="flex-col items-center justify-center hidden lg:flex z-[60] relative animate-none"
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        onClick={handleClick}
      >
        <span className="sr-only">Open main menu</span>
        <span
          className={`bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
            isOpen ? "opacity-0" : "opacity-100"
          } my-0.5`}
        ></span>
        <span
          className={`bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      <div className="w-full flex justify-center items-center lg:hidden">
        <div className="relative ">
          <nav className="relative flex items-center justify-center bg-dark shadow-lg rounded-xl px-8 py-3 border border-solid border-light z-10">
            <CustomLink className="mr-4" href="/" title="Home" />
            <CustomLink className="mx-4" href="/about" title="About" />
            <CustomLink className="mx-4" href="/projects" title="Projects" />
            <CustomLink className="mx-4" href="/blog" title="Blog" />
            <CustomLink className="mx-4" href="/guestbook" title="Guestbook" />
          </nav>
          <motion.div
            className="absolute left-36 top-1.5 -translate-y-1/2 ml-4 whitespace-nowrap font-bold text-4xl text-light pointer-events-none"
            animate={{ x: [0, 0, 360, 360, 0] }}
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
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClick}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            />

            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "top right" }}
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: -10 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    duration: 0.3,
                    staggerChildren: 0.05,
                    delayChildren: 0.05,
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 0.95,
                  y: -10,
                  transition: {
                    duration: 0.2,
                  },
                },
              }}
              className="absolute top-[calc(100%-12px)] right-8 md:right-6 sm:right-4 z-50 w-[85vw] max-w-[190px] bg-dark/95 border border-light/10 rounded-sm shadow-2xl p-1.5 backdrop-blur-md"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="absolute left-[50%] top-2 translate-x-[-50%] lg:hidden">
        <Logo />
      </div>
    </header>
  );
};

export default Navbar;
