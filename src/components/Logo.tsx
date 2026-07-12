import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

let MotionLink = motion(Link);

const Logo = () => {
  return <div className="flex flex-col items-center justify-center mt-2"></div>;
};

export default Logo;
