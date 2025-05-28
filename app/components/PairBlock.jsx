"use client";
import { FaInfoCircle } from "react-icons/fa";

const PairBlock = ({
  data,
  actualSelected,
  actualSide,
  setShowDetails,
  setActualWord,
}) => {
  return (
    <div
      className={
        "flex justify-between gap-2 items-center border-2 text-xl max-sm:text-base p-2 px-3 min-w-50 w-full max-sm:min-w-auto max-sm:w-full rounded-lg transition-colors " +
        (data._id === actualSelected._id &&
        data.side === actualSide &&
        data.side === "left"
          ? " border-warning bg-secondary/20 "
          : data._id === actualSelected._id &&
            data.side === actualSide &&
            data.side === "right"
          ? " border-warning bg-primary/20 "
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

      {data.side === "left" && (
        <FaInfoCircle
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(true);
            setActualWord(data.english);
          }}
          className="opacity-0 max-sm:opacity-25 group-hover:opacity-50 hover:opacity-100 transition-opacity duration-300"
          size={18}
        />
      )}
    </div>
  );
};
export default PairBlock;
