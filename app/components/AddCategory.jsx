"use client";
import { useState } from "react";

const AddCategory = ({ addCategoryHandler, categoriesList }) => {
  const [addCategory, setAddCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
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
      ) : (
        <button
          onClick={() => setAddCategory(true)}
          className="btn btn-outline btn-secondary btn-sm text-base mx-auto w-full max-w-2xl"
        >
          Nowa kategoria
        </button>
      )}
    </>
  );
};
export default AddCategory;
