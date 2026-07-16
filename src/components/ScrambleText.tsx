import React, { useEffect, useState } from "react";

interface ScrambleTextProps {
  text: string;
  delay?: number;
}

export default function ScrambleText({ text, delay = 0 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let frameId: number;

    const totalLength = text.length;
    let currentIteration = 0;

    // Initialize with underscores matching characters, keeping spaces as spaces
    const initial = text
      .split("")
      .map((char) => (/\s/.test(char) ? char : "_"))
      .join("");
    setDisplayText(initial);

    const startAnimation = () => {
      const step = () => {
        if (!isMounted) return;

        const scrambled = text
          .split("")
          .map((char, index) => {
            if (/\s/.test(char)) return char; // Preserve whitespace

            if (index < currentIteration) {
              return char; // Resolved character
            }

            // Lead scramble zone (e.g., next 12 characters are flickering)
            if (index < currentIteration + 12) {
              return Math.random() < 0.5
                ? chars[Math.floor(Math.random() * chars.length)]
                : "_";
            }

            // Unrevealed zone: static underscore
            return "_";
          })
          .join("");

        setDisplayText(scrambled);

        if (currentIteration < totalLength) {
          // Calculate reveal speed so it resolves smoothly and slowly (about 3 - 3.5 seconds)
          const revealSpeed = Math.max(0.4, totalLength / 200);
          currentIteration += revealSpeed;
          frameId = requestAnimationFrame(step);
        } else {
          setDisplayText(text); // Ensure exact match at the end
        }
      };

      frameId = requestAnimationFrame(step);
    };

    timeoutId = setTimeout(startAnimation, delay);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, [text, delay]);

  return <>{displayText}</>;
}
