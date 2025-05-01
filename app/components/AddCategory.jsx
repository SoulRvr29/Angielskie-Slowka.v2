"use client";
import { useState, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";

const AddCategory = ({ addCategoryHandler, categoriesList }) => {
  const [addCategory, setAddCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    setIsAddingCategory(false);
  }, [categoriesList]);

  return (
    <>
      {addCategory ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (categoriesList.includes(categoryName)) {
                alert("Taka kategoria już istnieje");
              } else if (categoryName !== "") {
                setIsAddingCategory(true);
                setAddCategory(false);
                addCategoryHandler(categoryName);
                setCategoryName("");
              }
            }}
            className=" max-w-2xl mx-auto w-full flex flex-col gap-4 px-2"
          >
            <input
              type="text"
              name="nowaKategoria"
              className="input w-full "
              onChange={(e) => setCategoryName(e.target.value)}
              autoFocus
              required
            />
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                className="btn btn-outline btn-success btn-sm text-base "
              >
                Dodaj kategorię
              </button>
              <button
                onClick={() => {
                  setAddCategory(false);
                }}
                className="btn btn-outline btn-error btn-sm text-base "
              >
                Anuluj
              </button>
            </div>
          </form>
        </>
      ) : isAddingCategory ? (
        <div className="btn btn-outline max-sm:w-[96vw] btn-secondary btn-sm text-base mx-auto w-full max-w-2xl">
          <LuLoaderCircle className="animate-spin" />
          <p>Dodawanie kategorii...</p>
        </div>
      ) : (
        <button
          onClick={() => setAddCategory(true)}
          className="btn btn-outline max-sm:w-[96vw] btn-secondary btn-sm text-base mx-auto w-full max-w-2xl max-sm:btn-md"
        >
          Nowa kategoria
        </button>
      )}
    </>
  );
};
export default AddCategory;
