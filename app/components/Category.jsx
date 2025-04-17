"use client";
import Link from "next/link";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";
import { useState, useEffect } from "react";

const Category = ({
  category,
  wordSets,
  actualCategory,
  setActualCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const normalizeString = (str) => {
    return str
      .split(" ")
      .join("_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/Ł/g, "L");
  };

  useEffect(() => {
    if (actualCategory === category) setIsOpen(true);
    else setIsOpen(false);
  }, [actualCategory]);

  return (
    <div
      className={`bg-primary/10 border-2 overflow-clip rounded-md max-sm:rounded-none flex flex-col ${
        isOpen ? "border-secondary/50" : "border-primary/50"
      }`}
    >
      <div
        onClick={() => {
          if (isOpen) setActualCategory(null);
          else setActualCategory(category);
        }}
        className={`flex cursor-pointer items-center justify-between gap-2 px-2 text-xl ${
          isOpen ? "bg-secondary/50" : "bg-primary/50"
        }`}
      >
        <div className="flex gap-2 pb-1 items-center">
          <h3 className="font-semibold">{category}</h3>
          <p className="border-2 border-base-content font-semibold rounded-full size-5 text-sm flex justify-center items-center">
            {wordSets.filter((item) => item.category === category).length}
          </p>
        </div>
        {!isOpen ? <FaCaretSquareDown /> : <FaCaretSquareUp />}
      </div>
      {isOpen && (
        <div className="flex flex-col flex-wrap gap-2 p-2">
          {wordSets.length > 0 ? (
            wordSets
              .filter((wordSet) => wordSet.category === category)
              .map((wordSet) => (
                <Link
                  href={`/zestawy/${normalizeString(wordSet.name)}`}
                  key={wordSet.name}
                  className="flex gap-2 w-fit hover:underline"
                >
                  <h3 className="">{wordSet.name}</h3>
                </Link>
              ))
          ) : (
            <div>Brak dostępnych zestawów</div>
          )}
        </div>
      )}
    </div>
  );
};
export default Category;
