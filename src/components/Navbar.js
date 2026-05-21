import Link from "next/link";
import React, { useState } from "react";
import Logo from "./Logo";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

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

const CustomMobileLink = ({ href, title, className = "", toggle }) => {
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <button
      className={`${className}  rounded relative group text-light`}
      onClick={handleClick}
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
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className="w-full max-w-full overflow-x-hidden flex items-center justify-between px-32 pt-10 pb-8 font-medium text-light
    lg:px-8 md:px-6 sm:px-4 lg:pt-8 relative z-10
    "
    >
      <button
        type="button"
        className="flex-col items-center justify-center hidden lg:flex z-[60] relative"
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
            <CustomLink className="ml-4" href="/guestbook" title="Guestbook" />
          </nav>
          <motion.div
            className="absolute left-36 top-1.5 -translate-y-1/2 ml-4 whitespace-nowrap font-bold text-4xl text-light pointer-events-none"
            animate={{ x: [0, 0, 330, 330, 0] }}
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
      {isOpen ? (
        <motion.div
          className="w-[40vw] sm:w-[65vw] flex justify-center items-center flex-col fixed top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 py-16 bg-dark/95 rounded-lg z-[55] backdrop-blur-md border border-light/20
      "
          initial={{ scale: 0, x: "-50%", y: "-50%", opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <nav className="flex items-center justify-center flex-col text-xl">
            <CustomMobileLink
              toggle={handleClick}
              className="my-3"
              href="/"
              title="Home"
            />
            <CustomMobileLink
              toggle={handleClick}
              className="my-3"
              href="/about"
              title="About"
            />
            <CustomMobileLink
              toggle={handleClick}
              className="my-3"
              href="/projects"
              title="Projects"
            />
            <CustomMobileLink
              toggle={handleClick}
              className="my-3"
              href="/blog"
              title="Blog"
            />
            <CustomMobileLink
              toggle={handleClick}
              className="my-3"
              href="/guestbook"
              title="Guestbook"
            />
          </nav>
        </motion.div>
      ) : null}

      <div className="absolute left-[50%] top-2 translate-x-[-50%] lg:hidden">
        <Logo />
      </div>
    </header>
  );
};

export default Navbar;
