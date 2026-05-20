import { motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

const Skills = () => {
  const [isPaused, setIsPaused] = useState(false);
  const skills = [
    { name: "HTML", logo: "html.png" },
    { name: "CSS", logo: "css.png" },
    { name: "JavaScript", logo: "javascript.png" },
    { name: "Vue.js", logo: "vuejs.png" },
    { name: "PHP", logo: "php.png" },
    { name: "React.js", logo: "reactjs.png" },
    { name: "Next.js", logo: "nextjs.png" },
    { name: "Laravel", logo: "laravel.png" },
    { name: "Bootstrap", logo: "bootstrap.png" },
    { name: "Tailwind", logo: "tailwind.png" },
    { name: "Dbeaver", logo: "dbeaver.png" },
    { name: "Git", logo: "git.png" },
    { name: "Figma", logo: "figma.png" },
    { name: "VsCode", logo: "vscode.png" }
  ];

  return (
    <>
      <h2
        className="font-bold text-4xl mt-32 w-full text-center md:text-6xl md:mt-16 bg-gradient-to-r from-purple-400 via-purple-800 to-purple-700 bg-clip-text text-transparent sm:!text-2xl xs:!text-2xl"
        style={{
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Skills
      </h2>
      <div
        className="w-full overflow-hidden py-12 mb-16 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <motion.div
          animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          className="flex gap-6 whitespace-nowrap"
        >
          {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-3 font-semibold text-light py-3 px-6 rounded-full  text-lg"
            >
              <Image
                src={`/images/logo-skill/${skill.logo}`}
                alt={skill.name}
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              {skill.name}
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Skills;
