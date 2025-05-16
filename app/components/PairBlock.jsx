"use client";
import "@/assets/styles/pairs.css";
import { useState, useEffect } from "react";

const PairBlock = ({ data, actualSelected, actualSide }) => {
  return (
    <div
      className={
        "border-2 text-xl max-sm:text-base p-2 px-3 min-w-50 max-sm:min-w-auto max-sm:w-full rounded-lg transition-colors " +
        (data._id === actualSelected._id &&
        data.side === actualSide &&
        data.side === "left"
          ? " border-base-content bg-secondary/20 "
          : data._id === actualSelected._id &&
            data.side === actualSide &&
            data.side === "right"
          ? " border-base-content bg-primary/20 "
          : data.color === "default" && data.side === "left"
          ? " border-secondary/50 bg-secondary/20"
          : data.color === "default" && data.side === "right"
          ? " border-primary/50 bg-primary/20"
          : data.color === "dimmed"
          ? " border-base-200/50 bg-base-300/20"
          : data.color === "success"
          ? " border-success/50 bg-success/20"
          : data.color === "error"
          ? " border-red-700/70 bg-red-700/40"
          : "")
      }
    >
      {data.side === "left" ? data.english : data.polish}
    </div>
  );
};
export default PairBlock;
