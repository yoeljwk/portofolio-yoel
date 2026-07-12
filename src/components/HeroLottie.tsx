"use client";

import Lottie from "lottie-react";
import animationData from "@/assets/lottie/coding-slide.json";

export default function HeroLottie() {
  return (
    <div className="w-[520px] h-[520px]">
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
}
