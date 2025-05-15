"use client";
import { useState, useEffect } from "react";

const PairBlock = ({
  data,
  word,
  color,
  correct,
  wrong,
  actualSelected,
  actualSide,
}) => {
  return (
    <div
      className={
        "border-2 text-xl max-sm:text-base p-2 px-3 min-w-50 max-sm:min-w-auto max-sm:w-full rounded-lg transition-colors " +
        (wrong === true
          ? " border-error/50 bg-error/20"
          : correct === true
          ? " border-success/50 bg-success/20"
          : color === "primary"
          ? " border-primary/50 bg-primary/20"
          : color === "secondary"
          ? " border-secondary/50 bg-secondary/20"
          : color === "base"
          ? " border-base-300 bg-base-300/50 opacity-50"
          : "") +
        (data._id === actualSelected._id && data.side === actualSide
          ? " border-white"
          : "")
      }
    >
      {word}
    </div>
  );
};
export default PairBlock;
