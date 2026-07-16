import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Braces,
  Code2,
  Terminal,
  Settings,
  FileCode,
  Hash,
  HelpCircle,
  FolderCode,
  Sliders,
  Database,
} from "lucide-react";

interface Particle {
  id: number;
  type: "icon" | "text";
  char?: string;
  iconName?: string;
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  rotation: number;
  rotationDirection: number;
}

const ICONS_MAP = {
  braces: Braces,
  code: Code2,
  terminal: Terminal,
  settings: Settings,
  fileCode: FileCode,
  hash: Hash,
  help: HelpCircle,
  folder: FolderCode,
  sliders: Sliders,
  database: Database,
};

const TEXT_SYMBOLS = [
  "{}", "[]", "</>", "()", "#", "%", "?", "&", ";", "!", "$", "*", "+", "=", "//", ">_", "~", "::", "=>", "++"
];

const COLORS = [
  { text: "text-purple-400", glow: "rgba(168, 85, 247, 0.4)" },
  { text: "text-cyan-400", glow: "rgba(34, 211, 238, 0.4)" },
  { text: "text-amber-400", glow: "rgba(251, 191, 36, 0.4)" },
  { text: "text-pink-400", glow: "rgba(244, 114, 182, 0.4)" },
  { text: "text-indigo-400", glow: "rgba(129, 140, 248, 0.4)" },
  { text: "text-emerald-400", glow: "rgba(52, 211, 153, 0.4)" },
  { text: "text-slate-400", glow: "rgba(148, 163, 184, 0.2)" },
];

export default function FloatingBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    const generatedParticles: Particle[] = [];
    const count = mobile ? 15 : 55;

    for (let i = 0; i < count; i++) {
      const isIcon = Math.random() > 0.55;
      const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];

      const particle: Particle = {
        id: i,
        type: isIcon ? "icon" : "text",
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.floor(Math.random() * 16) + 12,
        color: colorObj.text,
        glowColor: colorObj.glow,
        opacity: Math.random() * 0.3 + 0.15,
        driftX: (Math.random() - 0.5) * 120,
        driftY: (Math.random() - 0.5) * 120,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * -30,
        rotation: Math.random() * 360,
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
      };

      if (isIcon) {
        const keys = Object.keys(ICONS_MAP);
        particle.iconName = keys[Math.floor(Math.random() * keys.length)];
      } else {
        particle.char = TEXT_SYMBOLS[Math.floor(Math.random() * TEXT_SYMBOLS.length)];
      }

      generatedParticles.push(particle);
    }

    setParticles(generatedParticles);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1] select-none bg-black">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(20, 10, 35, 0.45) 0%, rgba(0, 0, 0, 1) 85%)"
        }}
      />

      {particles.map((p) => {
        let RenderedElement = null;

        if (p.type === "icon" && p.iconName) {
          const IconComponent = ICONS_MAP[p.iconName as keyof typeof ICONS_MAP];
          if (IconComponent) {
            RenderedElement = <IconComponent size={p.size} className="stroke-[1.5]" />;
          }
        } else if (p.char) {
          RenderedElement = <span>{p.char}</span>;
        }

        return (
          <motion.div
            key={p.id}
            className={`absolute ${p.color} will-change-transform`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              filter: isMobile ? undefined : `drop-shadow(0 0 6px ${p.glowColor})`,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: p.rotation,
              opacity: p.opacity,
            }}
            animate={{
              x: [0, p.driftX, p.driftX * 0.4, -p.driftX * 0.3, -p.driftX, 0],
              y: [0, p.driftY * 0.4, p.driftY, -p.driftY * 0.5, -p.driftY, 0],
              rotate: [p.rotation, p.rotation + 180 * p.rotationDirection, p.rotation + 360 * p.rotationDirection],
              opacity: [p.opacity, p.opacity * 0.7, p.opacity * 1.1, p.opacity * 0.8, p.opacity],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {RenderedElement}
          </motion.div>
        );
      })}
    </div>
  );
}
