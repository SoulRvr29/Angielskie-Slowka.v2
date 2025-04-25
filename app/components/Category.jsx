"use client";
import Link from "next/link";
import {
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaPlusSquare,
  FaTrashAlt,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import { useState, useEffect, use } from "react";

const Category = ({
  category,
  sets,
  actualCategory,
  setActualCategory,
  deleteCategoryHandler,
  editCategoryHandler,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);

  useEffect(() => {
    setIsEdit(false);
    setNewCategoryName(category);
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
        className={`flex flex-wrap items-center justify-between gap-2 px-3 text-xl max-sm:text-lg cursor-pointer  ${
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
          {isEdit ? (
            <form
              className="flex items-center gap-2 relative"
              onSubmit={(e) => {
                e.preventDefault();
                editCategoryHandler({
                  category: category,
                  newName: newCategoryName,
                });
                setIsEdit(false);
              }}
            >
              <input
                type="text"
                id="categoryName"
                className="border w-50 rounded-sm pl-2 -ml-2 pr-8 "
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button type="submit" className=" size-5 absolute right-2">
                <FaCheck />
              </button>
            </form>
          ) : (
            <h3 className="font-semibold cursor-pointer">{category}</h3>
          )}
          {/* <p className=" border-base-content font-semibold rounded-full size-5  flex justify-center items-center">
            ({sets.length})
          </p> */}
        </div>
        <div className="flex gap-4">
          <div
            className="cursor-pointer"
            onClick={() => {
              if (isOpen) setActualCategory(null);
              else setActualCategory(category);
            }}
          >
            {!isOpen ? (
              <FaCaretSquareDown
                className="hover:scale-110 transition-transform"
                title="rozwiń"
              />
            ) : (
              <div className="flex items-center gap-2">
                <FaEdit
                  className="hover:scale-110 transition-transform"
                  title="zmień nazwę"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEdit((prev) => !prev);
                  }}
                />
                <FaTrashAlt
                  title="usuń kategrię"
                  className="hover:scale-110 transition-transform"
                  size={18}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategoryHandler(category);
                  }}
                />
                <FaCaretSquareUp
                  className="hover:scale-110 transition-transform"
                  title="zwiń"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col flex-wrap gap-2 pt-2">
          {/* <div className="flex justify-between bg-secondary/20 px-3 border-b-2 border-secondary/20">
            <div>Nazwa zestawu:</div>
            <div>Słówek:</div>
          </div> */}
          {sets.length > 0 ? (
            sets.map((item) => (
              <div key={item.name} className="flex justify-between">
                <Link
                  href={`/zestawy/${item["_id"]}`}
                  className="flex gap-2 hover:bg-secondary/20 justify-between w-full px-2"
                >
                  {item.name}
                </Link>

                {/* <p>{item.words.length}</p> */}
              </div>
            ))
          ) : (
            <div className="px-2 opacity-50">Brak zestawów</div>
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
