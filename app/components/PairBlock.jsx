"use client";
import { useState } from "react";

const PairBlock = ({ word, color }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      onClick={() => setIsActive(true)}
      className={
        "border-2 text-xl max-sm:text-base p-2 px-3 min-w-50 max-sm:min-w-auto max-sm:w-full rounded-lg transition-colors " +
        (color === "primary"
          ? " border-primary/50 bg-primary/20 hover:border-primary/80 hover:bg-primary/40"
          : color === "secondary"
          ? " border-secondary/50 bg-secondary/20 hover:border-secondary/80 hover:bg-secondary/40"
          : " border-base-300 bg-base-300/50 opacity-50") +
        (isActive && " brightness-150")
      }
    >
      {word}
    </div>
  );
};
export default PairBlock;
