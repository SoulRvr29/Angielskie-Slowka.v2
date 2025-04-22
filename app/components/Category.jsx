"use client";
import Link from "next/link";
import {
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaPlusSquare,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const Category = ({
  category,
  wordSets,
  actualCategory,
  setActualCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (actualCategory === category) setIsOpen(true);
    else setIsOpen(false);
  }, [actualCategory]);

  return (
    <div
      className={`bg-primary/10 border-2 overflow-clip rounded-md max-sm:rounded-none flex flex-col ${
        isOpen ? "border-secondary/50" : "border-primary/30"
      }`}
    >
      <div
        onClick={() => {
          if (isOpen) setActualCategory(null);
          else setActualCategory(category);
        }}
        className={`flex  items-center justify-between gap-2 px-3 text-xl cursor-pointer ${
          isOpen ? "bg-secondary/50" : "bg-primary/30"
        }`}
      >
        <div
          onClick={() => {
            if (isOpen) setActualCategory(null);
            else setActualCategory(category);
          }}
          className="flex gap-2 pb-1 items-center"
        >
          <h3 className="font-semibold cursor-pointer">{category}</h3>
          <p className=" border-base-content font-semibold rounded-full size-5  flex justify-center items-center">
            ({wordSets.filter((item) => item.category === category).length})
          </p>
        </div>
        <div className="flex gap-4">
          <div
            className="cursor-pointer"
            onClick={() => {
              if (isOpen) setActualCategory(null);
              else setActualCategory(category);
            }}
          >
            {!isOpen ? <FaCaretSquareDown /> : <FaCaretSquareUp />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col flex-wrap gap-2 pt-2">
          {/* <div className="flex justify-between bg-secondary/20 px-3 border-b-2 border-secondary/20">
            <div>Nazwa zestawu:</div>
            <div>Słówek:</div>
          </div> */}
          {wordSets.length > 0 ? (
            wordSets
              .filter((wordSet) => wordSet.category === category)
              .map((wordSet) => (
                <div key={wordSet.name} className="flex justify-between px-2 ">
                  <Link
                    href={`/zestawy/${wordSet["_id"]}`}
                    className="flex gap-2 w-fit hover:underline justify-between"
                  >
                    {wordSet.name}
                  </Link>

                  {/* <p>{wordSet.words.length}</p> */}
                </div>
              ))
          ) : (
            <div>Brak dostępnych zestawów</div>
          )}
          <button>
            <Link
              className="flex justify-center items-center gap-2 border-t-2 border-secondary/50 py-1 bg-secondary/10 hover:bg-secondary/20"
              href={{
                pathname: "/zestawy/nowy",
                query: { category: category },
              }}
            >
              <FaPlusSquare title="dodaj zestaw" /> <p>Dodaj nowy zestaw</p>
            </Link>
          </button>
        </div>
      )}
    </div>
  );
};
export default Category;
