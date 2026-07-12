import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const cardColors = [
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-yellow-500 to-red-500",
];

export default function ImageSlider({ images }) {
  const [cards, setCards] = useState(images.map((img, i) => ({ id: i, img })));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleShuffle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setCards((prev) => {
      const newCards = [...prev];
      const lastCard = newCards.pop();
      newCards.unshift(lastCard);
      return newCards;
    });

    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center cursor-pointer group" 
      onClick={handleShuffle}
      onMouseEnter={handleShuffle}
    >
      <div
        className="slider-container relative"
        style={{
          width: "240px",
          height: "360px",
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`absolute rounded-2xl shadow-2xl ${cardColors[card.id % cardColors.length]}`}
            initial={false}
            animate={{
              left: `${index * 18}px`,
              top: `${-index * 18}px`,
              zIndex: cards.length - index,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              width: "240px",
              aspectRatio: "2/3",
            }}
          >
            <div className="p-3 h-full flex flex-col">
              <div className="relative flex-1 rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm">
                <Image
                  className="h-full w-full object-cover"
                  src={card.img}
                  alt={`Slide ${card.id + 1}`}
                  width={240}
                  height={360}
                  priority={index === 0}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
