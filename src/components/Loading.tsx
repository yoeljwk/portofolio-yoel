import { useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function Loading() {
  useEffect(() => {
    gsap.to(".logo-box", {
      keyframes: {
        y: [0, 80, -10, 30, 0],
        ease: "none",
        easeEach: "power2.inOut"
      },
      rotate: 360,
      ease: "elastic",
      duration: 5,
      stagger: 0.2,
      repeat: -1
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex -space-x-4">
        <div className="logo-box">
          <Image
            src="/images/logoyoel.png"
            alt="Loading"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>
        <div className="logo-box">
          <Image
            src="/images/logoyoel.png"
            alt="Loading"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>
        <div className="logo-box">
          <Image
            src="/images/logoyoel.png"
            alt="Loading"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>
        <div className="logo-box">
          <Image
            src="/images/logoyoel.png"
            alt="Loading"
            width={100}
            height={100}
            className="w-24 h-24"
          />
        </div>
      </div>
    </div>
  );
}
