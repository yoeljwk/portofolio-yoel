import { useState, useEffect } from "react";

export default function TypewriterText({ text, speed = 200, className = "" }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;

    const type = () => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    };

    const interval = setInterval(type, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <h1 className={className}>
      {displayedText}
    </h1>
  );
}
