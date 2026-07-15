"use client";

import Lottie from "lottie-react";
import animationData from "@/assets/lottie/coding-slide.json";

export default function HeroLottie() {
  return (
    <div className="w-[520px] h-[520px] md:w-[380px] md:h-[380px] sm:w-[300px] sm:h-[300px] xs:w-[260px] xs:h-[260px] flex items-center justify-center">
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
}
