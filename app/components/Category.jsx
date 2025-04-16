"use client";
import Link from "next/link";
import { FaCaretSquareDown, FaCaretSquareUp } from "react-icons/fa";
import { useState, useEffect } from "react";

const Category = ({ category, wordSets, collapseAll }) => {
  const [isOpen, setIsOpen] = useState(collapseAll);

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
    setIsOpen(collapseAll);
  }, [collapseAll]);

  return (
    <div className="bg-base-300 overflow-clip rounded-md max-sm:rounded-none flex flex-col">
      <div className="flex items-center justify-between gap-2 bg-primary/50 px-2 text-xl">
        <div className="flex gap-2">
          <h3 className="font-semibold">{category}</h3>
          <p className="text-base">
            ({wordSets.filter((item) => item.category === category).length})
          </p>
        </div>
        {!isOpen ? (
          <button onClick={() => setIsOpen((prev) => !prev)}>
            {" "}
            <FaCaretSquareDown />
          </button>
        ) : (
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaCaretSquareUp />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="flex flex-wrap gap-4 p-4">
          {wordSets.length > 0 ? (
            wordSets
              .filter((wordSet) => wordSet.category === category)
              .map((wordSet) => (
                <Link
                  href={`/zestawy/${normalizeString(wordSet.name)}`}
                  key={wordSet.name}
                  className="bg-base-content/10 hover:bg-primary/40 p-2 px-4 rounded-md  cursor-pointer transition-colors max-sm:w-full"
                >
                  <h3 className="font-semibold text-xl">{wordSet.name}</h3>
                  <p>{wordSet.words.length} słówek</p>
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
