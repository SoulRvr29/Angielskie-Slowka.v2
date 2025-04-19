"use client";
import Category from "../components/Category";
import { useEffect, useState } from "react";
import Link from "next/link";

const getCategories = (data) => {
  return [...new Set(data.map((item) => item.category).sort())];
};

const WordSetsPage = () => {
  const [wordSets, setWordSets] = useState(null);
  const [actualCategory, setActualCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/zestawy`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();

        setWordSets(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWords();
  }, []);

  if (!wordSets) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base-300/30 flex flex-col gap-4">
        <p className="text-info animate-pulse delayFadeIn">
          Pobieranie zestawów
        </p>
        <span className="loader"></span>
      </div>
    );
  }
  const categories = getCategories(wordSets);

  const newCategoryHandler = (name) => {
    console.log(name);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between border-b border-info text-info mb-4 max-sm:px-2">
        <h2 className="">Publiczne zestawy</h2>
        <button className="btn btn-outline btn-info btn-sm">
          <Link href="zestawy/wlasne"> Własne zestawy</Link>
        </button>
      </div>
      <div className="flex flex-col gap-4 max-sm:gap-2 max-w-2xl mx-auto w-full">
        {categories.map((category) => (
          <Category
            key={category}
            category={category}
            wordSets={wordSets}
            actualCategory={actualCategory}
            setActualCategory={setActualCategory}
          />
        ))}
        {addCategory ? (
          <form
            className=" max-w-2xl mx-auto w-full flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              name="nowaKategoria"
              className="input w-full"
              autoFocus
            />
            <button
              type="submit"
              onClick={(e) => {
                setAddCategory(false);
                newCategoryHandler(e.target.parentElement[0].value);
              }}
              className="btn btn-outline btn-secondary btn-sm text-base "
            >
              Dodaj kategorię
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAddCategory(true)}
            className="btn btn-outline btn-secondary btn-sm text-base mx-auto w-full max-w-2xl"
          >
            Nowa kategoria
          </button>
        )}
      </div>
    </div>
  );
};
export default WordSetsPage;
