import { motion } from "framer-motion";
import React from "react";

interface SplitTextMoriProps {
  text: string;
  className?: string;
  isAppLoading?: boolean;
}

const SplitTextMori = ({ text, className = "", isAppLoading = false }: SplitTextMoriProps) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 80,
      rotateX: 180,
      z: -50,
      transformPerspective: 650,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      z: 0,
      transition: {
        duration: 1.0,
        ease: [0.34, 1.56, 0.64, 1], // Custom cubic-bezier mimicking back.out
      },
    },
  };

  return (
    <div className="py-2 w-full mx-auto flex flex-col items-center justify-center text-center sm:py-0">
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate={isAppLoading ? "hidden" : "visible"}
        style={{ perspective: 1000, transformStyle: "preserve-3d" }}
        className={`inline-block text-light font-mori w-full ${className}`}
      >
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-flex whitespace-nowrap mx-2" style={{ transformStyle: "preserve-3d" }}>
            {word.split("").map((char, charIdx) => (
              <motion.span
                key={charIdx}
                variants={charVariants}
                className="char-box"
                style={{
                  transformOrigin: "0% 50% -50px",
                  transformStyle: "preserve-3d",
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.h1>
    </div>
  );
};

export default SplitTextMori;
