import { motion } from "framer-motion";
import Image from "next/image";

const TransitionEffect = () => {
  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-light dark:bg-dark"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src="/images/logoyoel.png"
          alt="Transition"
          width={100}
          height={100}
          className="w-24 h-24"
        />
      </motion.div>
    </motion.div>
  );
};

export default TransitionEffect;
