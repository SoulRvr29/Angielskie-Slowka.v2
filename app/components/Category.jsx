"use client";
import Link from "next/link";
import {
  FaCaretSquareDown,
  FaCaretSquareUp,
  FaPlusSquare,
  FaTrashAlt,
  FaEdit,
  FaCheck,
  FaCheckSquare,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, delay, easeInOut, motion } from "framer-motion";

const Category = ({
  category,
  sets,
  actualCategory,
  setActualCategory,
  deleteCategoryHandler,
  editCategoryHandler,
  admin,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category);
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsEdit(false);
    setNewCategoryName(category);
    if (actualCategory === category) setIsOpen(true);
    else setIsOpen(false);
    setIsDeleting(false);
  }, [actualCategory]);

  const countComplete = () => {
    const complete = sets.reduce((sum, set) => {
      return set.words.every((word) => {
        return word.known === true;
      }) === true
        ? sum + 1
        : sum;
    }, 0);
    return complete;
  };

  return (
    <div
      className={`bg-primary/10 border-2 overflow-clip rounded-md max-sm:rounded-none flex flex-col ${
        sets.length > 0 &&
        sets.every((set) => set.words.every((word) => word.known === true)) &&
        "category-checked"
      } ${isOpen ? "border-secondary/50" : "border-primary/30"}`}
    >
      <div
        onClick={() => {
          if (isOpen) setActualCategory(null);
          else setActualCategory(category);
        }}
        className={`flex flex-wrap items-center justify-between gap-2 max-sm:py-1 px-3 text-xl max-sm:text-lg cursor-pointer  ${
          isOpen ? "bg-secondary/50" : "bg-primary/30"
        }`}
      >
        <div
          onClick={() => {
            if (isOpen) setActualCategory(null);
            else setActualCategory(category);
          }}
          className="flex gap-2 py-1 items-center"
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
            <>
              {sets.length === countComplete() && (
                <FaCheckSquare className="checked" />
              )}
              <h3 className="font-semibold cursor-pointer">{category}</h3>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <div
            className="text-base opacity-75 -mr-1 "
            title="ukończone zestawy"
          >
            {countComplete()}/{sets.length}
          </div>

          <div
            className="cursor-pointer"
            onClick={() => {
              if (isOpen) setActualCategory(null);
              else setActualCategory(category);
            }}
          >
            {!isOpen ? (
              <FaCaretSquareDown
                className="hover:scale-110 transition-transform "
                title="rozwiń"
              />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {admin && (
                    <>
                      <FaEdit
                        className="hover:scale-110 transition-transform"
                        title="zmień nazwę"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEdit((prev) => !prev);
                        }}
                      />
                      {isDeleting ? (
                        <LuLoaderCircle className="animate-spin" />
                      ) : (
                        <FaTrashAlt
                          title="usuń kategrię"
                          className="hover:scale-110 transition-transform"
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            const confirmed = confirm("Potwierdź usunięcie");
                            if (!confirmed) return;
                            deleteCategoryHandler(category);
                            setIsDeleting(true);
                          }}
                        />
                      )}
                    </>
                  )}
                  <FaCaretSquareUp
                    className="hover:scale-110 transition-transform"
                    title="zwiń"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{
              height: { duration: 0.3 },
            }}
            className=" flex flex-col flex-wrap"
          >
            <div>
              {/* <div className="flex justify-between bg-secondary/30 px-3 border-b-2 border-secondary/50 category-sub">
            <div>Nazwa zestawu:</div>
            <div>{session ? "Znane słówka:" : "Słówka:"}</div>
          </div> */}
              {sets.length > 0 ? (
                sets.map((item) => (
                  <motion.div
                    transition={{ duration: 2 }}
                    key={item.name}
                    className="overflow-hidden flex justify-between items-center max-sm:py-1 border-b border-secondary/30 last-of-type:border-none px-3 hover:bg-secondary/20 set-line"
                  >
                    {item.words.reduce(
                      (sum, word) => (word.known === true ? sum + 1 : sum),
                      0
                    ) === item.words.length && (
                      <FaCheckSquare
                        className="mr-2 text-success checked"
                        size={20}
                      />
                    )}
                    <Link
                      href={`${pathname}/${item["_id"]}?type=${type}`}
                      className="flex gap-2  justify-between w-full py-1"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-1">
                      {session && (
                        <>
                          <div>
                            {
                              (item.words.length,
                              item.words.reduce(
                                (sum, word) =>
                                  word.known === true ? sum + 1 : sum,
                                0
                              ))
                            }
                          </div>
                          /
                        </>
                      )}
                      <div>{item.words.length}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-2 opacity-50 py-1 max-sm:py-2">
                  Brak zestawów
                </div>
              )}
              {admin && (
                <Link
                  className="flex justify-center items-center gap-2 border-t-2 border-secondary/50 py-1 bg-secondary/20 hover:bg-secondary/50 max-sm:py-2 add-new-set"
                  href={{
                    pathname: `${pathname}/nowy`,
                    query: { category: category, type: type },
                  }}
                >
                  <FaPlusSquare title="dodaj zestaw" /> <p>Dodaj nowy zestaw</p>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Category;
